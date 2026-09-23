import { 
  getAccessToken, 
  getProjectId, 
  decodeFirestoreDoc 
} from './client';
import { 
  UserDocument, 
  GlobalSettingsDocument, 
  DeviceInfo, 
  DayRecordDocument, 
  GlobalAppConfig 
} from '../types/admin';

export const DEFAULT_CONFIG: GlobalAppConfig = {
  features: {
    enableCloudSync: true,
    maintenanceMode: false,
  },
  defaults: {
    dailyGoalGlasses: 8,
    glassSizeMl: 250,
    reminderInterval: 30,
    dayResetHour: 6,
    inactiveThreshold: 10,
  },
  updatedAt: Date.now(),
  updatedBy: 'Admin Portal',
};

function getBaseUrl(): string {
  const projectId = getProjectId();
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

/**
 * Direct Firebase Query: Get all users from `/users` collection
 */
export async function getUsers(): Promise<UserDocument[]> {
  const token = await getAccessToken();
  const res = await fetch(`${getBaseUrl()}/users?pageSize=100`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 404) return [];
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firestore query failed: ${err}`);
  }

  const json = await res.json();
  if (!json.documents) return [];

  return json.documents.map((d: any) => {
    const obj = decodeFirestoreDoc<any>(d);
    const parts = d.name.split('/');
    const photoURL = obj.photoURL || obj.photoUrl || obj.avatarUrl || obj.picture || obj.photo || null;
    return {
      ...obj,
      uid: obj.uid || parts[parts.length - 1],
      photoURL,
    } as UserDocument;
  });
}

/**
 * Direct Firebase Query: Get a user profile document
 */
export async function getUser(userId: string): Promise<UserDocument | null> {
  const token = await getAccessToken();
  const res = await fetch(`${getBaseUrl()}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firestore user query failed: ${err}`);
  }

  const json = await res.json();
  const obj = decodeFirestoreDoc<any>(json);
  const photoURL = obj.photoURL || obj.photoUrl || obj.avatarUrl || obj.picture || obj.photo || null;
  return {
    ...obj,
    uid: obj.uid || userId,
    photoURL,
  } as UserDocument;
}

/**
 * Direct Firebase Query: Get user hydration preferences
 */
export async function getUserSettings(userId: string): Promise<GlobalSettingsDocument | null> {
  const token = await getAccessToken();
  const res = await fetch(`${getBaseUrl()}/users/${userId}/settings/preferences`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 404) return null;
  if (!res.ok) return null;

  const json = await res.json();
  return decodeFirestoreDoc<GlobalSettingsDocument>(json);
}

/**
 * Direct Firebase Query: Get user daily hydration history records
 */
export async function getUserDays(userId: string): Promise<DayRecordDocument[]> {
  const token = await getAccessToken();
  const res = await fetch(`${getBaseUrl()}/users/${userId}/days?pageSize=30`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return [];
  const json = await res.json();
  if (!json.documents) return [];

  return (json.documents as any[])
    .map((d: any) => {
      const parts = d.name.split('/');
      return {
        ...decodeFirestoreDoc<DayRecordDocument>(d),
        date: parts[parts.length - 1],
      };
    })
    .sort((a: DayRecordDocument, b: DayRecordDocument) => b.date.localeCompare(a.date));
}

/**
 * Direct Firebase Query: Get user devices by checking:
 * 1. `users/{userId}/devices` subcollection
/**
 * Direct Firebase Query: Get real registered client devices from `users/{userId}/devices` subcollection
 */
export async function getUserDevices(userId: string): Promise<DeviceInfo[]> {
  const token = await getAccessToken();
  const res = await fetch(`${getBaseUrl()}/users/${userId}/devices?pageSize=50`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 404 || !res.ok) return [];

  const json = await res.json();
  if (!json.documents || !Array.isArray(json.documents)) return [];

  return json.documents.map((d: any) => {
    const parts = d.name.split('/');
    const docId = parts[parts.length - 1];
    const dev = decodeFirestoreDoc<DeviceInfo>(d);
    return {
      deviceId: dev.deviceId || docId,
      deviceName: dev.deviceName || docId,
      platform: dev.platform || 'macos',
      osVersion: dev.osVersion,
      appVersion: dev.appVersion,
      lastActiveAt: dev.lastActiveAt || 0,
      deviceSettings: dev.deviceSettings,
      sittingMinutes: dev.sittingMinutes,
      idleMinutes: dev.idleMinutes,
    };
  });
}

/**
 * Direct Firebase Query: Get complete user details in parallel
 */
export async function getUserFullProfile(userId: string): Promise<{
  user: UserDocument;
  settings: GlobalSettingsDocument | null;
  devices: DeviceInfo[];
  days: DayRecordDocument[];
}> {
  const [user, settings, devices, days] = await Promise.all([
    getUser(userId),
    getUserSettings(userId),
    getUserDevices(userId),
    getUserDays(userId),
  ]);

  if (!user) {
    throw new Error(`User ${userId} not found in Firestore.`);
  }

  return { user, settings, devices, days };
}

/**
 * Direct Firebase Query: Get global app settings from `config/global_settings`
 */
export async function getGlobalConfig(): Promise<GlobalAppConfig> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${getBaseUrl()}/config/global_settings`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const json = await res.json();
      const raw = decodeFirestoreDoc<any>(json);
      if (raw) {
        const features = {
          enableCloudSync: raw.features?.enableCloudSync ?? raw.enableCloudSync ?? DEFAULT_CONFIG.features.enableCloudSync,
          maintenanceMode: raw.features?.maintenanceMode ?? raw.maintenanceMode ?? DEFAULT_CONFIG.features.maintenanceMode,
        };

        const defaults = {
          dailyGoalGlasses: raw.defaults?.dailyGoalGlasses ?? raw.dailyGoalGlasses ?? DEFAULT_CONFIG.defaults.dailyGoalGlasses,
          glassSizeMl: raw.defaults?.glassSizeMl ?? raw.glassSizeMl ?? DEFAULT_CONFIG.defaults.glassSizeMl,
          reminderInterval: raw.defaults?.reminderInterval ?? raw.reminderInterval ?? DEFAULT_CONFIG.defaults.reminderInterval,
          dayResetHour: raw.defaults?.dayResetHour ?? raw.dayResetHour ?? DEFAULT_CONFIG.defaults.dayResetHour,
          inactiveThreshold: raw.defaults?.inactiveThreshold ?? raw.inactiveThreshold ?? DEFAULT_CONFIG.defaults.inactiveThreshold,
        };

        return {
          features,
          defaults,
          updatedAt: raw.updatedAt || Date.now(),
          updatedBy: raw.updatedBy || 'Admin Portal',
        };
      }
    }
  } catch (err) {
    console.warn('[firebase] Global config query error, using default config:', err);
  }

  return DEFAULT_CONFIG;
}
