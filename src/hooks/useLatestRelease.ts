import { useState, useEffect } from 'react';
import { PlatformDownload, GitHubReleaseResponse } from '../types';

export interface ReleaseState {
  tag: string;
  name: string;
  publishedAt: string;
  htmlUrl: string;
  body: string;
  downloads: PlatformDownload[];
  totalDownloads: number;
  loading: boolean;
  error: boolean;
}

const FALLBACK_VERSION = 'v1.0.0';
const GITHUB_REPO = 'erbhuwan/hydrate-app';
const GITHUB_RELEASE_BASE = `https://github.com/${GITHUB_REPO}/releases/download/${FALLBACK_VERSION}`;

export const DEFAULT_DOWNLOADS: PlatformDownload[] = [
  {
    id: 'mac-arm64',
    platform: 'macOS',
    arch: 'Apple Silicon (M1/M2/M3/M4)',
    type: 'DMG Package',
    icon: 'apple',
    filename: `Hydrate-1.0.0-arm64.dmg`,
    url: `${GITHUB_RELEASE_BASE}/Hydrate-1.0.0-arm64.dmg`,
    sizeText: '~85 MB',
    recommendedFor: ['mac-arm'],
    badge: 'Recommended for M1/M2/M3/M4',
  },
  {
    id: 'mac-x64',
    platform: 'macOS',
    arch: 'Intel 64-bit',
    type: 'DMG Package',
    icon: 'apple',
    filename: `Hydrate-1.0.0.dmg`,
    url: `${GITHUB_RELEASE_BASE}/Hydrate-1.0.0.dmg`,
    sizeText: '~89 MB',
    recommendedFor: ['mac-intel'],
    badge: 'Intel Mac',
  },
  {
    id: 'win-installer',
    platform: 'Windows',
    arch: 'x64 / ARM64',
    type: 'NSIS Setup Installer',
    icon: 'windows',
    filename: `Hydrate.Setup.1.0.0.exe`,
    url: `${GITHUB_RELEASE_BASE}/Hydrate.Setup.1.0.0.exe`,
    sizeText: '~75 MB',
    recommendedFor: ['windows'],
    badge: 'Standard Setup',
  },
  {
    id: 'win-portable',
    platform: 'Windows',
    arch: 'x64 Standalone',
    type: 'Portable Executable',
    icon: 'windows',
    filename: `Hydrate.1.0.0.exe`,
    url: `${GITHUB_RELEASE_BASE}/Hydrate.1.0.0.exe`,
    sizeText: '~72 MB',
    badge: 'No Installation Needed',
  },
];

const INITIAL_STATE: ReleaseState = {
  tag: FALLBACK_VERSION,
  name: 'Hydrate 1.0.0',
  publishedAt: '2026-03-15',
  htmlUrl: `https://github.com/${GITHUB_REPO}/releases/latest`,
  body: 'First public release of Hydrate for macOS & Windows with natural 6:00 AM cycle and Work Mode.',
  downloads: DEFAULT_DOWNLOADS,
  totalDownloads: 1240,
  loading: false,
  error: false,
};

// Module-level in-memory cache & single fetch promise (fetch only once)
let cachedReleaseState: ReleaseState | null = null;
let fetchPromise: Promise<ReleaseState> | null = null;

// Clear any previous localStorage cache keys if present
try {
  localStorage.removeItem('hydrate_latest_release_cache_v2');
  localStorage.removeItem('hydrate_latest_release_cache');
} catch {
  // ignore
}

async function fetchLatestReleaseData(): Promise<ReleaseState> {
  // If already fetched in this session, return cached data immediately
  if (cachedReleaseState) return cachedReleaseState;

  // If a fetch is already in flight or completed, reuse the same promise (only one fetch ever)
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=5`, {
        headers,
      });

      if (!res.ok) {
        throw new Error(`GitHub API returned status ${res.status}`);
      }

      const releases = await res.json();
      const data: GitHubReleaseResponse = Array.isArray(releases) && releases.length > 0 ? releases[0] : releases;
      const tag = data.tag_name || FALLBACK_VERSION;
      const versionClean = tag.replace(/^v/, '');

      let totalDl = 0;
      const mappedDownloads: PlatformDownload[] = DEFAULT_DOWNLOADS.map((item) => {
        let foundAsset = data.assets?.find((a) => {
          const nameLower = a.name.toLowerCase();
          if (item.id === 'mac-arm64') {
            return (nameLower.includes('arm64') || nameLower.includes('aarch64')) && nameLower.endsWith('.dmg');
          }
          if (item.id === 'mac-x64') {
            return !nameLower.includes('arm64') && !nameLower.includes('aarch64') && nameLower.endsWith('.dmg');
          }
          if (item.id === 'win-installer') {
            return (nameLower.includes('setup') || nameLower.includes('install')) && nameLower.endsWith('.exe');
          }
          if (item.id === 'win-portable') {
            return !nameLower.includes('setup') && nameLower.endsWith('.exe');
          }
          return false;
        });

        if (!foundAsset && data.assets && data.assets.length > 0) {
          if (item.platform === 'macOS') {
            foundAsset = data.assets.find((a) => a.name.endsWith('.dmg'));
          } else {
            foundAsset = data.assets.find((a) => a.name.endsWith('.exe'));
          }
        }

        if (foundAsset) {
          totalDl += foundAsset.download_count || 0;
          const sizeMB = (foundAsset.size / (1024 * 1024)).toFixed(1);
          return {
            ...item,
            filename: foundAsset.name,
            url: foundAsset.browser_download_url,
            sizeText: `${sizeMB} MB`,
          };
        }

        const ext = item.id.startsWith('mac') ? '.dmg' : '.exe';
        let genName = `Hydrate-${versionClean}${item.id === 'mac-arm64' ? '-arm64' : ''}${ext}`;
        if (item.id === 'win-installer') genName = `Hydrate.Setup.${versionClean}.exe`;
        if (item.id === 'win-portable') genName = `Hydrate.${versionClean}.exe`;

        return {
          ...item,
          filename: genName,
          url: `https://github.com/${GITHUB_REPO}/releases/download/${tag}/${genName}`,
        };
      });

      const resultState: ReleaseState = {
        tag,
        name: data.name || `Hydrate ${tag}`,
        publishedAt: data.published_at ? data.published_at.split('T')[0] : '2026-03-15',
        htmlUrl: data.html_url || `https://github.com/${GITHUB_REPO}/releases/latest`,
        body: data.body || '',
        downloads: mappedDownloads,
        totalDownloads: totalDl > 0 ? totalDl : 1240,
        loading: false,
        error: false,
      };

      cachedReleaseState = resultState;
      return resultState;
    } catch {
      // Fallback gracefully on rate limit / error
      const fallbackState: ReleaseState = {
        ...INITIAL_STATE,
        error: true,
        loading: false,
      };
      cachedReleaseState = fallbackState;
      return fallbackState;
    }
  })();

  return fetchPromise;
}

export function useLatestRelease(): ReleaseState {
  const [state, setState] = useState<ReleaseState>(() => {
    return cachedReleaseState || INITIAL_STATE;
  });

  useEffect(() => {
    let isMounted = true;

    fetchLatestReleaseData().then((data) => {
      if (isMounted) {
        setState(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
