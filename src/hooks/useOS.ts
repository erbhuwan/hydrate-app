import { useState, useEffect } from 'react';
import { OSType } from '../types';

export interface OSInfo {
  os: OSType;
  osName: string;
  isMac: boolean;
  isWindows: boolean;
  isAppleSilicon: boolean;
  recommendedInstallerName: string;
  recommendedInstallerExt: string;
  icon: string;
}

export function useOS(): OSInfo {
  const [osInfo, setOsInfo] = useState<OSInfo>({
    os: 'mac-arm',
    osName: 'macOS (Apple Silicon)',
    isMac: true,
    isWindows: false,
    isAppleSilicon: true,
    recommendedInstallerName: 'Hydrate (Apple Silicon .dmg)',
    recommendedInstallerExt: '.dmg',
    icon: 'apple',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = (window.navigator as unknown as { userAgentData?: { platform?: string } })?.userAgentData?.platform?.toLowerCase() || window.navigator.platform?.toLowerCase() || '';

    const isMac = userAgent.includes('mac') || platform.includes('mac');
    const isWindows = userAgent.includes('win') || platform.includes('win');
    const isLinux = userAgent.includes('linux') || platform.includes('linux');

    // WebGL renderer detection for Apple Silicon (M1/M2/M3/M4) vs Intel
    let isAppleSilicon = false;
    if (isMac) {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            if (renderer && (renderer.includes('Apple') || renderer.includes('M1') || renderer.includes('M2') || renderer.includes('M3') || renderer.includes('M4'))) {
              isAppleSilicon = true;
            }
          }
        }
      } catch {
        // Fallback default for modern Macs
        isAppleSilicon = true;
      }
      // If we couldn't determine, modern macOS users in 2025/2026 are mostly Apple Silicon
      if (!isAppleSilicon && !userAgent.includes('intel')) {
        isAppleSilicon = true;
      }
    }

    if (isMac) {
      if (isAppleSilicon) {
        setOsInfo({
          os: 'mac-arm',
          osName: 'macOS (Apple Silicon)',
          isMac: true,
          isWindows: false,
          isAppleSilicon: true,
          recommendedInstallerName: 'Hydrate for Apple Silicon (M1/M2/M3/M4)',
          recommendedInstallerExt: '.dmg',
          icon: 'apple',
        });
      } else {
        setOsInfo({
          os: 'mac-intel',
          osName: 'macOS (Intel)',
          isMac: true,
          isWindows: false,
          isAppleSilicon: false,
          recommendedInstallerName: 'Hydrate for macOS (Intel 64-bit)',
          recommendedInstallerExt: '.dmg',
          icon: 'apple',
        });
      }
    } else if (isWindows) {
      setOsInfo({
        os: 'windows',
        osName: 'Windows',
        isMac: false,
        isWindows: true,
        isAppleSilicon: false,
        recommendedInstallerName: 'Hydrate for Windows (x64 Setup)',
        recommendedInstallerExt: '.exe',
        icon: 'windows',
      });
    } else if (isLinux) {
      setOsInfo({
        os: 'linux',
        osName: 'Linux',
        isMac: false,
        isWindows: false,
        isAppleSilicon: false,
        recommendedInstallerName: 'macOS / Windows Supported',
        recommendedInstallerExt: '',
        icon: 'monitor',
      });
    }
  }, []);

  return osInfo;
}
