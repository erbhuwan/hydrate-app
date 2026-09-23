import { 
  getAccessToken, 
  getProjectId, 
  encodeFirestoreDoc, 
  decodeFirestoreDoc 
} from './client';
import { 
  UserDocument, 
  GlobalSettingsDocument, 
  GlobalAppConfig 
} from '../types/admin';

function getBaseUrl(): string {
  const projectId = getProjectId();
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

/**
 * Generic Field-Level Patch helper:
 * Uses Firestore `updateMask.fieldPaths` so only the specifically changed fields are updated
 * and NO other existing document fields are overwritten or replaced.
 */
export async function patchFirestoreDocument<T>(
  path: string,
  partialData: Record<string, any>,
  customMask?: string[]
): Promise<T> {
  const token = await getAccessToken();
  const encoded = encodeFirestoreDoc(partialData);

  // Derive updateMask from the keys of partialData or customMask
  const maskFields = customMask || Object.keys(partialData);
  const maskQuery = maskFields
    .map((f) => `updateMask.fieldPaths=${encodeURIComponent(f)}`)
    .join('&');

  const url = `${getBaseUrl()}/${path}${maskQuery ? `?${maskQuery}` : ''}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(encoded),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to patch Firestore document ${path}: ${err}`);
  }

  const json = await res.json();
  return decodeFirestoreDoc<T>(json);
}

/**
 * Direct Firebase Mutation: Update ONLY changed user preferences in `/users/{userId}/settings/preferences`
 * (Preserves hasCompletedOnboarding, creation dates, and any other existing preferences)
 */
export async function updateUserSettings(
  userId: string,
  changedPreferences: Partial<GlobalSettingsDocument>
): Promise<GlobalSettingsDocument> {
  const payload = {
    ...changedPreferences,
    updatedAt: Date.now(),
  };

  return await patchFirestoreDocument<GlobalSettingsDocument>(
    `users/${userId}/settings/preferences`,
    payload
  );
}

/**
 * Direct Firebase Mutation: Update specific fields of a user profile in `/users/{userId}`
 * (Preserves user credentials, tokens, devices, and profile metadata)
 */
export async function updateUserFields(
  userId: string,
  changedFields: Partial<UserDocument>
): Promise<UserDocument> {
  const payload = {
    ...changedFields,
    updatedAt: Date.now(),
  };

  return await patchFirestoreDocument<UserDocument>(
    `users/${userId}`,
    payload
  );
}

/**
 * Direct Firebase Mutation: Update user Pro subscription status in `/users/{userId}`
 * (Only updates isPro, subscription, and updatedAt fields without touching the rest of user profile)
 */
export async function updateUserPro(
  userId: string,
  isPro: boolean,
  plan: string = 'lifetime',
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'unpaid' | 'inactive' = 'active'
): Promise<UserDocument> {
  const subscription = {
    isPro,
    plan: isPro ? plan : undefined,
    status: isPro ? status : 'inactive',
    unlockedAt: isPro ? Date.now() : undefined,
  };

  const payload = {
    isPro,
    subscription,
    updatedAt: Date.now(),
  };

  return await patchFirestoreDocument<UserDocument>(
    `users/${userId}`,
    payload,
    ['isPro', 'subscription', 'updatedAt']
  );
}

/**
 * Complete Document Replacement helper:
 * Writes full document to Firestore without updateMask so parent-level legacy/duplicate fields are removed.
 */
export async function setFirestoreDocument<T>(
  path: string,
  data: Record<string, any>
): Promise<T> {
  const token = await getAccessToken();
  const encoded = encodeFirestoreDoc(data);
  const url = `${getBaseUrl()}/${path}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(encoded),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to set Firestore document ${path}: ${err}`);
  }

  const json = await res.json();
  return decodeFirestoreDoc<T>(json);
}

/**
 * Direct Firebase Mutation: Save global application configuration to `/config/global_settings`
 * (Stores features and defaults in their respective nested maps only, keeping the parent document clean)
 */
export async function saveGlobalConfig(config: GlobalAppConfig): Promise<GlobalAppConfig> {
  const payload = {
    features: {
      enableCloudSync: Boolean(config.features.enableCloudSync),
      maintenanceMode: Boolean(config.features.maintenanceMode),
    },
    defaults: {
      dailyGoalGlasses: Number(config.defaults.dailyGoalGlasses) || 8,
      glassSizeMl: Number(config.defaults.glassSizeMl) || 250,
      reminderInterval: Number(config.defaults.reminderInterval) || 30,
      dayResetHour: Number(config.defaults.dayResetHour) ?? 6,
      inactiveThreshold: Number(config.defaults.inactiveThreshold) || 10,
    },
    updatedAt: Date.now(),
    updatedBy: 'Admin Portal',
  };

  return await setFirestoreDocument<GlobalAppConfig>(
    'config/global_settings',
    payload
  );
}

/**
 * Direct Firebase Mutation: Delete a client device from `/users/{userId}/devices/{deviceId}`
 */
export async function deleteUserDevice(userId: string, deviceId: string): Promise<boolean> {
  const token = await getAccessToken();
  const url = `${getBaseUrl()}/users/${userId}/devices/${deviceId}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to remove device from Firestore: ${err}`);
  }

  return true;
}

/**
 * Direct Firebase Mutation: Delete a user document from `/users/{userId}`
 */
export async function deleteUser(userId: string): Promise<boolean> {
  const token = await getAccessToken();
  const url = `${getBaseUrl()}/users/${userId}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to delete user in Firestore: ${err}`);
  }

  return true;
}
