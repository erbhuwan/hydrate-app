export type OSType = 'mac-arm' | 'mac-intel' | 'windows' | 'linux' | 'unknown';

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
}

export interface GitHubReleaseResponse {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body: string;
  assets: ReleaseAsset[];
}

export interface PlatformDownload {
  id: string;
  platform: 'macOS' | 'Windows';
  arch: string;
  type: string;
  icon: string;
  filename: string;
  url: string;
  sizeText: string;
  recommendedFor?: OSType[];
  badge?: string;
}

export interface CalculatorInputs {
  weight: number;
  weightUnit: 'kg' | 'lbs';
  deskHours: number;
  activityLevel: 'sedentary' | 'moderate' | 'intense';
}

export interface CalculatorResults {
  dailyTargetMl: number;
  dailyTargetOz: number;
  glassesCount: number; // based on 250ml glass
  intervalMinutes: number;
  sittingRatio: string; // e.g. "250 ml / 60 min active"
}
