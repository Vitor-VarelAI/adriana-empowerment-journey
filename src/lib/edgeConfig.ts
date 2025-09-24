import { createClient } from '@vercel/edge-config';

interface AppConfig {
  timeZone: string;
  workingDays: string;
  workingHours: string;
  bookingSlotMinutes: number;
  currency: string;
  sessionPrice: number;
  cancellationPolicyHours: number;
  maxAdvanceBookingDays: number;
  minAdvanceBookingHours: number;
  features: {
    payments: boolean;
    googleCalendar: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  defaults: {
    sessionDuration: number;
    locationType: 'online' | 'presencial' | 'hybrid';
    maxParticipants: number;
  };
}

const DAY_CODES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
const DAY_LABELS: Record<(typeof DAY_CODES)[number], string> = {
  SUN: "Sunday",
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
};

function expandWorkingDayCodes(value: string): string[] {
  const segments = value
    .toUpperCase()
    .split(/[,\s]+/)
    .filter(Boolean);

  const result = new Set<string>();

  for (const segment of segments) {
    if (segment.includes("-")) {
      const [startCode, endCode] = segment.split("-");
      const startIndex = DAY_CODES.indexOf(startCode as (typeof DAY_CODES)[number]);
      const endIndex = DAY_CODES.indexOf(endCode as (typeof DAY_CODES)[number]);
      if (startIndex === -1 || endIndex === -1) continue;

      let index = startIndex;
      result.add(DAY_LABELS[DAY_CODES[index]]);
      while (index !== endIndex) {
        index = (index + 1) % DAY_CODES.length;
        result.add(DAY_LABELS[DAY_CODES[index]]);
      }
    } else if (DAY_CODES.includes(segment as (typeof DAY_CODES)[number])) {
      result.add(DAY_LABELS[segment as (typeof DAY_CODES)[number]]);
    }
  }

  return Array.from(result.size ? result : DAY_CODES.slice(1, 6).map((code) => DAY_LABELS[code]));
}

// Initialize Edge Config client only if we have a valid URL
let edgeConfig: ReturnType<typeof createClient> | null = null;

try {
  if (process.env.EDGE_CONFIG && process.env.EDGE_CONFIG !== 'https://edge-config.vercel.com/ecv_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0') {
    edgeConfig = createClient(process.env.EDGE_CONFIG);
  }
} catch (error) {
  console.warn('Failed to initialize Edge Config client:', error);
}

// Default fallback configuration
const defaultConfig: AppConfig = {
  timeZone: 'Europe/London',
  workingDays: 'MON-FRI',
  workingHours: '09:00-17:00',
  bookingSlotMinutes: 30,
  currency: 'BRL',
  sessionPrice: 150,
  cancellationPolicyHours: 24,
  maxAdvanceBookingDays: 30,
  minAdvanceBookingHours: 2,
  features: {
    payments: false,
    googleCalendar: true,
    emailNotifications: true,
    smsNotifications: false,
  },
  defaults: {
    sessionDuration: 60,
    locationType: 'online',
    maxParticipants: 1,
  },
};

export class EdgeConfigManager {
  private static instance: EdgeConfigManager;
  private config: AppConfig | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): EdgeConfigManager {
    if (!EdgeConfigManager.instance) {
      EdgeConfigManager.instance = new EdgeConfigManager();
    }
    return EdgeConfigManager.instance;
  }

  async getConfig(): Promise<AppConfig> {
    try {
      // Check if we have cached config and it's still valid
      if (this.config && Date.now() - this.lastFetch < this.CACHE_TTL) {
        return this.config;
      }

      // Check if Edge Config is available
      if (!edgeConfig) {
        console.warn('Edge Config not configured, using fallback configuration');
        return defaultConfig;
      }

      // Try to fetch from Edge Config
      const config = await edgeConfig.get<AppConfig>('app-config');

      if (config) {
        this.config = config;
        this.lastFetch = Date.now();
        return config;
      }

      // Fallback to default config
      console.warn('Edge Config not available, using fallback configuration');
      return defaultConfig;
    } catch (error) {
      console.warn('Failed to fetch Edge Config, using fallback:', error);
      return defaultConfig;
    }
  }

  async getValue<T>(key: string): Promise<T | undefined> {
    try {
      if (!edgeConfig) return undefined;
      return await edgeConfig.get<T>(key);
    } catch (error) {
      console.warn(`Failed to fetch Edge Config value for key "${key}":`, error);
      return undefined;
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      if (!edgeConfig) return false;
      return await edgeConfig.has(key);
    } catch (error) {
      console.warn(`Failed to check Edge Config key "${key}":`, error);
      return false;
    }
  }

  // Convenience methods for common configuration values
  async getTimeZone(): Promise<string> {
    const config = await this.getConfig();
    return config.timeZone;
  }

  async getWorkingHours(): Promise<{ start: string; end: string; days: string[] }> {
    const config = await this.getConfig();
    const [start, end] = config.workingHours.split('-');
    const days = expandWorkingDayCodes(config.workingDays);

    return {
      start,
      end,
      days,
    };
  }

  async getBookingSettings(): Promise<{
    slotMinutes: number;
    minAdvanceHours: number;
    maxAdvanceDays: number;
    cancellationHours: number;
  }> {
    const config = await this.getConfig();
    return {
      slotMinutes: config.bookingSlotMinutes,
      minAdvanceHours: config.minAdvanceBookingHours,
      maxAdvanceDays: config.maxAdvanceBookingDays,
      cancellationHours: config.cancellationPolicyHours,
    };
  }

  async isFeatureEnabled(feature: keyof AppConfig['features']): Promise<boolean> {
    const config = await this.getConfig();
    return config.features[feature];
  }

  // Clear cache (useful for testing or forced refresh)
  clearCache(): void {
    this.config = null;
    this.lastFetch = 0;
  }
}

// Export singleton instance
export const edgeConfigManager = EdgeConfigManager.getInstance();

// Export convenience functions
export const getAppConfig = () => edgeConfigManager.getConfig();
export const getTimeZone = () => edgeConfigManager.getTimeZone();
export const getWorkingHours = () => edgeConfigManager.getWorkingHours();
export const getBookingSettings = () => edgeConfigManager.getBookingSettings();
export const isFeatureEnabled = (feature: keyof AppConfig['features']) =>
  edgeConfigManager.isFeatureEnabled(feature);
