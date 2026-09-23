import { useState, useEffect, useCallback } from 'react';
import { 
  UserDocument, 
  GlobalSettingsDocument, 
  DeviceInfo, 
  DayRecordDocument 
} from '../types/admin';
import { 
  getUserFullProfile, 
  updateUserSettings,
  deleteUserDevice 
} from '../firebase';

export function useUserDetails(userId: string) {
  const [user, setUser] = useState<UserDocument | null>(null);
  const [settings, setSettings] = useState<GlobalSettingsDocument | null>(null);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [days, setDays] = useState<DayRecordDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const loadDetails = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserFullProfile(userId);
      setUser(data.user);
      setSettings(data.settings);
      setDevices(data.devices);
      setDays(data.days);
    } catch (err: any) {
      console.error(`[useUserDetails] Failed to load user ${userId}:`, err);
      setError(err.message || 'Failed to fetch user details from Firestore.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  // Mutation: Save User Hydration Preferences
  const handleSaveSettings = async (
    preferences: Partial<GlobalSettingsDocument>
  ): Promise<{ success: boolean; error?: string }> => {
    setIsMutating(true);
    try {
      await updateUserSettings(userId, preferences);
      setSettings((prev) => ({
        dailyGoalGlasses: 8,
        glassSizeMl: 250,
        dayResetHour: 6,
        hasCompletedOnboarding: true,
        ...prev,
        ...preferences,
        updatedAt: Date.now(),
      }));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update user preferences in Firestore.' };
    } finally {
      setIsMutating(false);
    }
  };

  // Mutation: Remove a registered client device
  const handleRemoveDevice = async (deviceId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await deleteUserDevice(userId, deviceId);
      setDevices((prev) => prev.filter((d) => d.deviceId !== deviceId));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to remove device.' };
    }
  };

  return {
    user,
    settings,
    devices,
    days,
    isLoading,
    error,
    isMutating,
    refetch: loadDetails,
    saveSettings: handleSaveSettings,
    removeDevice: handleRemoveDevice,
  };
}
