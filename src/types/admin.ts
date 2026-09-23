export type PlatformType = 'macos' | 'windows' | 'web' | 'linux';
export type AppearanceMode = 'system' | 'light' | 'dark';
export type AlertStyle =
  | 'os_notification'
  | 'dynamic_island'
  | 'screen_glow'
  | 'corner_bubble'
  | 'zen_screen';

export type ReminderStateStatus = 'active' | 'paused' | 'snoozed' | 'idle_paused';

export interface UserSubscription {
  isPro: boolean;
  plan?: 'monthly' | 'yearly' | 'lifetime' | 'bypass' | string;
  status?: 'active' | 'trialing' | 'canceled' | 'past_due' | 'unpaid' | 'inactive' | string;
  currentPeriodEnd?: number;
  stripeCustomerId?: string;
  unlockedAt?: number;
}

export interface FirebaseUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastSyncedAt: number | null;
  isPro?: boolean;
  subscription?: UserSubscription;
}

export interface UserDocument extends FirebaseUserProfile {
  primaryPlatform?: PlatformType | string;
  device?: string;
  schemaVersion?: number;
  lastActiveAt?: number;
  updatedAt?: number;
  createdAt?: number;
  currentDevice?: DeviceInfo;
  connectedDevices?: DeviceInfo[];
  devices?: Record<string, DeviceInfo> | DeviceInfo[];
}

export interface GlobalSettingsDocument {
  dailyGoalGlasses: number;
  glassSizeMl: number;
  dayResetHour?: number;
  hasCompletedOnboarding?: boolean;
  updatedAt?: number;
}

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  platform: PlatformType | string;
  osVersion?: string;
  appVersion?: string;
  lastActiveAt: number;
  sittingMinutes?: number;
  idleMinutes?: number;
  deviceSettings?: {
    appearance?: AppearanceMode;
    alertStyle?: AlertStyle;
    reminderInterval?: number;
    remindersEnabled?: boolean;
    workMode?: boolean;
    inactiveThreshold?: number;
    launchAtLogin?: boolean;
    notificationSound?: boolean;
    selectedNotificationSound?: string;
    selectedDrinkSound?: string;
  };
}

export interface DeviceActivityInfo {
  deviceName: string;
  platform: string;
  sittingMinutes: number;
  idleMinutes: number;
  lastActiveAt: number;
  hourlyActivity?: { [hour: number]: { activeMinutes: number; idleMinutes: number } };
}

export interface DrinkRecordAppStateSnapshot {
  dailyGoalGlasses: number;
  dailyGoalLiters: number;
  glassSizeMl: number;
  glassesTodaySoFar: number;
  millilitersTodaySoFar: number;
  percentCompleted?: number;
  reachedGoal?: boolean;
  reminderInterval: number;
  remindersEnabled: boolean;
  workMode: boolean;
  appearance?: AppearanceMode;
  alertStyle?: AlertStyle;
  dayResetHour?: number;
  sittingMinutes: number;
  idleMinutes: number;
  reminderStatus?: ReminderStateStatus;
  isUserActive?: boolean;
  deviceId?: string;
  deviceName?: string;
  platform?: 'macos' | 'windows' | 'web' | 'linux' | string;
  osVersion?: string;
  appVersion?: string;
  recordedAt?: number;
}

export interface DrinkRecord {
  id: string;
  timestamp: number;
  amountMl: number;
  deviceId?: string;
  deviceName?: string;
  platform?: string;
  state?: DrinkRecordAppStateSnapshot;
}

export interface DayStateSnapshot {
  goalGlasses: number;
  goalLiters: number;
  glassSizeMl: number;
  totalGlasses?: number;
  totalMilliliters?: number;
  percentCompleted?: number;
  reachedGoal?: boolean;
  lastRecordedTimestamp?: number;
  reminderInterval: number;
  remindersEnabled: boolean;
  workMode: boolean;
  appearance?: AppearanceMode;
  alertStyle?: AlertStyle;
  dayResetHour?: number;
  totalSittingMinutes?: number;
  totalIdleMinutes?: number;
  deviceId?: string;
  deviceName?: string;
  platform?: 'macos' | 'windows' | 'web' | 'linux' | string;
  osVersion?: string;
  appVersion?: string;
  lastUpdatedAt?: number;
}

export interface DayRecordDocument {
  date: string;
  glasses: number;
  milliliters: number;
  timestamps: number[];
  drinks?: DrinkRecord[];
  sittingMinutes?: number;
  idleMinutes?: number;
  hourlyActivity?: { [hour: number]: { activeMinutes: number; idleMinutes: number } };
  deviceActivity?: { [deviceId: string]: DeviceActivityInfo };
  stateSnapshot?: DayStateSnapshot;
  updatedAt?: number;
}

export interface GlobalAppConfig {
  features: {
    enableCloudSync: boolean;
    maintenanceMode: boolean;
  };
  defaults: {
    dailyGoalGlasses: number;
    glassSizeMl: number;
    reminderInterval: number;
    dayResetHour: number;
    inactiveThreshold: number;
  };
  updatedAt: number;
  updatedBy?: string;
}

export interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain?: string;
}
