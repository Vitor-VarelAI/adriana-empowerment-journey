import { getWorkingHours, getBookingSettings } from "@/lib/edgeConfig";

const DAY_MAP: Record<string, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

export type WorkingScheduleConfig = {
  workingDays: Set<number>;
  slotMinutes: number;
  periods: Array<{ startMinutes: number; endMinutes: number }>;
};

function parseWorkingDays(workingDaysString: string): Set<number> {
  const envValue = workingDaysString.toUpperCase();
  const parts = envValue.split(/[,\s]+/).filter(Boolean);
  const days = new Set<number>();

  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-");
      const startIdx = DAY_MAP[start];
      const endIdx = DAY_MAP[end];
      if (startIdx === undefined || endIdx === undefined) continue;
      for (let current = startIdx; ; current = (current + 1) % 7) {
        days.add(current);
        if (current === endIdx) break;
      }
    } else {
      const idx = DAY_MAP[part];
      if (idx !== undefined) {
        days.add(idx);
      }
    }
  }

  return days.size > 0 ? days : new Set([1, 2, 3, 4, 5]);
}

function parseWorkingHours(workingHoursString: string): Array<{ startMinutes: number; endMinutes: number }> {
  const envValue = workingHoursString;
  const segments = envValue.split(/[,;]+/).map((segment) => segment.trim());

  const periods: Array<{ startMinutes: number; endMinutes: number }> = [];
  for (const segment of segments) {
    if (!segment) continue;
    const [start, end] = segment.split("-");
    if (!start || !end) continue;
    const startMinutes = toMinutes(start);
    const endMinutes = toMinutes(end);
    if (startMinutes >= endMinutes) continue;
    periods.push({ startMinutes, endMinutes });
  }

  if (periods.length === 0) {
    periods.push({ startMinutes: 9 * 60, endMinutes: 17 * 60 });
  }

  return periods;
}

function toMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map((part) => parseInt(part, 10));
  return hours * 60 + (minutes || 0);
}

let cachedScheduleConfig: WorkingScheduleConfig | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getScheduleConfig(): Promise<WorkingScheduleConfig> {
  // Return cached config if still valid
  if (cachedScheduleConfig && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedScheduleConfig;
  }

  try {
    const [workingHours, bookingSettings] = await Promise.all([
      getWorkingHours(),
      getBookingSettings()
    ]);

    const config: WorkingScheduleConfig = {
      workingDays: new Set(workingHours.days.map(day => {
        switch (day) {
          case 'Monday': return 1;
          case 'Tuesday': return 2;
          case 'Wednesday': return 3;
          case 'Thursday': return 4;
          case 'Friday': return 5;
          case 'Saturday': return 6;
          case 'Sunday': return 0;
          default: return 1;
        }
      })),
      slotMinutes: bookingSettings.slotMinutes,
      periods: parseWorkingHours(`${workingHours.start}-${workingHours.end}`)
    };

    // Cache the config
    cachedScheduleConfig = config;
    cacheTimestamp = Date.now();

    return config;
  } catch (error) {
    console.warn('Failed to fetch config from Edge Config, using defaults:', error);

    // Fallback to environment variables
    const fallbackConfig: WorkingScheduleConfig = {
      workingDays: parseWorkingDays(process.env.WORKING_DAYS || "MON-FRI"),
      slotMinutes: Math.max(5, parseInt(process.env.BOOKING_SLOT_MINUTES || "30", 10)),
      periods: parseWorkingHours(process.env.WORKING_HOURS || "09:00-17:00")
    };

    return fallbackConfig;
  }
}

// Export synchronous version for backward compatibility
export function getScheduleConfigSync(): WorkingScheduleConfig {
  if (cachedScheduleConfig) {
    return cachedScheduleConfig;
  }

  // Fallback to environment variables for synchronous calls
  const fallbackConfig: WorkingScheduleConfig = {
    workingDays: parseWorkingDays(process.env.WORKING_DAYS || "MON-FRI"),
    slotMinutes: Math.max(5, parseInt(process.env.BOOKING_SLOT_MINUTES || "30", 10)),
    periods: parseWorkingHours(process.env.WORKING_HOURS || "09:00-17:00")
  };

  return fallbackConfig;
}

export async function computeSlotsForDate(date: Date): Promise<string[]> {
  const config = await getScheduleConfig();
  if (!config.workingDays.has(date.getDay())) {
    return [];
  }

  const slots: string[] = [];

  for (const period of config.periods) {
    let cursor = period.startMinutes;
    while (cursor + config.slotMinutes <= period.endMinutes + 0.0001) {
      const hours = Math.floor(cursor / 60)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor(cursor % 60)
        .toString()
        .padStart(2, "0");
      slots.push(`${hours}:${minutes}`);
      cursor += config.slotMinutes;
    }
  }

  return slots;
}

// Keep synchronous version for backward compatibility
export function computeSlotsForDateSync(date: Date): string[] {
  const config = getScheduleConfigSync();
  if (!config.workingDays.has(date.getDay())) {
    return [];
  }

  const slots: string[] = [];

  for (const period of config.periods) {
    let cursor = period.startMinutes;
    while (cursor + config.slotMinutes <= period.endMinutes + 0.0001) {
      const hours = Math.floor(cursor / 60)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor(cursor % 60)
        .toString()
        .padStart(2, "0");
      slots.push(`${hours}:${minutes}`);
      cursor += config.slotMinutes;
    }
  }

  return slots;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}
