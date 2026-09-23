export * from './client';
export * from './queries';
export * from './mutations';

import { 
  UserDocument, 
  DayRecordDocument, 
  DeviceInfo, 
  DeviceActivityInfo 
} from '../types/admin';

// Business logic & Ergonomics calculations
export function getHydrationDate(date: Date = new Date(), resetHour: number = 6): Date {
  const d = new Date(date);
  if (d.getHours() < resetHour) {
    d.setDate(d.getDate() - 1);
  }
  return d;
}

export function getTodayKey(date: Date = new Date(), resetHour: number = 6): string {
  const d = getHydrationDate(date, resetHour);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isUserPro(userDoc: UserDocument): boolean {
  if (!userDoc) return false;
  const sub = userDoc.subscription;
  if (!sub) return Boolean(userDoc.isPro);
  const isProFlag = Boolean(userDoc.isPro || sub.isPro);
  const status = sub.status;
  
  if (!isProFlag) return false;
  if (status && status !== 'active' && status !== 'trialing') return false;
  
  return true;
}

export function calculateSedentaryRisk(sittingMinutes: number = 0, lastDrinkTimeMs?: number): {
  isSedentaryWarning: boolean;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  message: string;
} {
  const minutesSinceDrink = lastDrinkTimeMs ? Math.floor((Date.now() - lastDrinkTimeMs) / (60 * 1000)) : 0;
  
  if (sittingMinutes >= 120 || minutesSinceDrink >= 120) {
    return {
      isSedentaryWarning: true,
      riskLevel: 'critical',
      message: 'Critical sedentary duration (>2 hrs desk sitting). Stand up and hydrate.',
    };
  }
  if (sittingMinutes >= 60 || minutesSinceDrink >= 60) {
    return {
      isSedentaryWarning: true,
      riskLevel: 'high',
      message: 'Sedentary alert triggered: Sitting continuously ≥ 60 mins without drink.',
    };
  }
  if (sittingMinutes >= 35) {
    return {
      isSedentaryWarning: false,
      riskLevel: 'moderate',
      message: 'Active desk session in progress. Optimal hydration cadence.',
    };
  }
  return {
    isSedentaryWarning: false,
    riskLevel: 'low',
    message: 'Optimal posture and hydration rhythm.',
  };
}

export function extractDaySittingMinutes(
  dayRecord?: DayRecordDocument | null,
  devices?: DeviceInfo[]
): { sittingMinutes: number; idleMinutes: number } {
  if (!dayRecord) {
    if (devices && devices.length > 0) {
      const devSitting = devices.reduce((sum, d) => sum + (d.sittingMinutes || 0), 0);
      const devIdle = devices.reduce((sum, d) => sum + (d.idleMinutes || 0), 0);
      return { sittingMinutes: Math.round(devSitting), idleMinutes: Math.round(devIdle) };
    }
    return { sittingMinutes: 0, idleMinutes: 0 };
  }

  let sitting = dayRecord.sittingMinutes || 0;
  let idle = dayRecord.idleMinutes || 0;

  // 1. Check stateSnapshot for totalSittingMinutes
  if (!sitting && dayRecord.stateSnapshot) {
    sitting =
      dayRecord.stateSnapshot.totalSittingMinutes ||
      (dayRecord.stateSnapshot as any).sittingMinutes ||
      0;
  }
  if (!idle && dayRecord.stateSnapshot) {
    idle =
      dayRecord.stateSnapshot.totalIdleMinutes ||
      (dayRecord.stateSnapshot as any).idleMinutes ||
      0;
  }

  // 2. Check deviceActivity map (aggregate across active devices for this day)
  if (!sitting && dayRecord.deviceActivity && typeof dayRecord.deviceActivity === 'object') {
    const devEntries = Object.values(dayRecord.deviceActivity) as DeviceActivityInfo[];
    if (devEntries.length > 0) {
      const sumSitting = devEntries.reduce((sum: number, dev: DeviceActivityInfo) => sum + (dev.sittingMinutes || 0), 0);
      if (sumSitting > 0) sitting = sumSitting;
      if (!idle) {
        const sumIdle = devEntries.reduce((sum: number, dev: DeviceActivityInfo) => sum + (dev.idleMinutes || 0), 0);
        if (sumIdle > 0) idle = sumIdle;
      }
    }
  }

  // 3. Check hourlyActivity map (sum active minutes across all hours)
  if (!sitting && dayRecord.hourlyActivity && typeof dayRecord.hourlyActivity === 'object') {
    const hourEntries = Object.values(dayRecord.hourlyActivity) as { activeMinutes?: number; idleMinutes?: number }[];
    if (hourEntries.length > 0) {
      const sumActive = hourEntries.reduce((sum: number, h: { activeMinutes?: number; idleMinutes?: number }) => sum + (h.activeMinutes || 0), 0);
      if (sumActive > 0) sitting = sumActive;
      if (!idle) {
        const sumIdle = hourEntries.reduce((sum: number, h: { activeMinutes?: number; idleMinutes?: number }) => sum + (h.idleMinutes || 0), 0);
        if (sumIdle > 0) idle = sumIdle;
      }
    }
  }

  // 4. Check latest drink log state snapshot
  if (!sitting && dayRecord.drinks && Array.isArray(dayRecord.drinks) && dayRecord.drinks.length > 0) {
    for (let i = dayRecord.drinks.length - 1; i >= 0; i--) {
      const drink = dayRecord.drinks[i];
      if (drink.state && typeof drink.state.sittingMinutes === 'number' && drink.state.sittingMinutes > 0) {
        sitting = drink.state.sittingMinutes;
        if (!idle && typeof drink.state.idleMinutes === 'number') {
          idle = drink.state.idleMinutes;
        }
        break;
      }
    }
  }

  // 5. Fallback to attached devices
  if (!sitting && devices && devices.length > 0) {
    const devSitting = devices.reduce((sum, d) => sum + (d.sittingMinutes || 0), 0);
    if (devSitting > 0) sitting = devSitting;
    if (!idle) {
      const devIdle = devices.reduce((sum, d) => sum + (d.idleMinutes || 0), 0);
      if (devIdle > 0) idle = devIdle;
    }
  }

  return {
    sittingMinutes: Math.round(sitting),
    idleMinutes: Math.round(idle),
  };
}

export function calculateWaterPerSittingHour(milliliters: number, sittingMinutes: number): number {
  if (!sittingMinutes || sittingMinutes <= 0) return milliliters;
  const hours = sittingMinutes / 60;
  return Math.round(milliliters / hours);
}

