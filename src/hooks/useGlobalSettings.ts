import { useState, useEffect, useCallback } from 'react';
import { GlobalAppConfig } from '../types/admin';
import { getGlobalConfig, saveGlobalConfig, DEFAULT_CONFIG } from '../firebase';

export function useGlobalSettings() {
  const [config, setConfig] = useState<GlobalAppConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getGlobalConfig();
      setConfig(data);
    } catch (err: any) {
      console.error('[useGlobalSettings] Failed to fetch global settings:', err);
      setError(err.message || 'Failed to fetch global config from Firestore.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const toggleFeature = (featureKey: keyof GlobalAppConfig['features']) => {
    setConfig((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: !prev.features[featureKey],
      },
    }));
  };

  const updateDefaults = (newDefaults: Partial<GlobalAppConfig['defaults']>) => {
    setConfig((prev) => ({
      ...prev,
      defaults: {
        ...prev.defaults,
        ...newDefaults,
      },
    }));
  };

  const save = async (): Promise<{ success: boolean; error?: string }> => {
    setIsSaving(true);
    setError(null);
    try {
      const saved = await saveGlobalConfig(config);
      setConfig(saved);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Failed to publish changes to Firestore.');
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  };

  const resetToFactoryDefaults = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return {
    config,
    isLoading,
    isSaving,
    error,
    saveSuccess,
    toggleFeature,
    updateDefaults,
    save,
    resetToFactoryDefaults,
    refetch: loadConfig,
  };
}
