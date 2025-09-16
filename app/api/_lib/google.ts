import { google } from "googleapis";

export type StoredTokens = {
  accessToken?: string | null;
  refreshToken?: string | null;
  expiryDate?: number | null;
};

export type GoogleConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  calendarId?: string;
  adminEmail?: string;
  defaultTimeZone: string;
  refreshToken?: string;
};

const REQUIRED_ENV = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
];

function assertEnv(name: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return value;
}

function resolveRedirectUri(): string {
  const explicit =
    process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_OAUTH_REDIRECT_URI;
  if (explicit && explicit.length > 0) {
    return explicit;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${siteUrl.replace(/\/$/, "")}/api/auth/callback`;
}

export function getGoogleConfig(): GoogleConfig {
  REQUIRED_ENV.forEach((envName) => assertEnv(envName, process.env[envName]));

  const clientId = assertEnv("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
  const clientSecret = assertEnv(
    "GOOGLE_CLIENT_SECRET",
    process.env.GOOGLE_CLIENT_SECRET,
  );

  const redirectUri = resolveRedirectUri();
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const adminEmail = process.env.ADMIN_EMAIL;
  const defaultTimeZone =
    process.env.HOST_TZ || process.env.DEFAULT_TIME_ZONE || "Europe/Lisbon";

  return {
    clientId,
    clientSecret,
    redirectUri,
    calendarId,
    adminEmail,
    defaultTimeZone,
    refreshToken: refreshToken || undefined,
  };
}

let tokenStore: Map<string, StoredTokens>;

declare global {
  // eslint-disable-next-line no-var
  var __googleTokenStore: Map<string, StoredTokens> | undefined;
}

if (globalThis.__googleTokenStore) {
  tokenStore = globalThis.__googleTokenStore;
} else {
  tokenStore = new Map<string, StoredTokens>();
  globalThis.__googleTokenStore = tokenStore;
}

function getTokenKey(config: GoogleConfig): string {
  return config.adminEmail || config.calendarId || "default";
}

export function saveTokens(config: GoogleConfig, tokens: StoredTokens) {
  const key = getTokenKey(config);
  const existing = tokenStore.get(key) || {};
  tokenStore.set(key, {
    ...existing,
    ...tokens,
  });
}

export function getStoredTokens(config: GoogleConfig): StoredTokens | null {
  if (config.refreshToken) {
    return { refreshToken: config.refreshToken };
  }
  const key = getTokenKey(config);
  return tokenStore.get(key) || null;
}

export function createOAuthClient(config: GoogleConfig) {
  return new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri,
  );
}

export async function getAuthorizedCalendar(config: GoogleConfig) {
  const tokens = getStoredTokens(config);
  if (!tokens || !tokens.refreshToken) {
    throw new Error(
      "No refresh token available. Authorize the Google integration first.",
    );
  }

  const client = createOAuthClient(config);
  client.setCredentials({ refresh_token: tokens.refreshToken });
  const calendar = google.calendar({ version: "v3", auth: client });

  return { calendar, authClient: client };
}

export function extractStoredTokens(oAuthClient: ReturnType<typeof createOAuthClient>) {
  const credentials = oAuthClient.credentials;
  if (!credentials) {
    return null;
  }

  return {
    accessToken: credentials.access_token || undefined,
    refreshToken: credentials.refresh_token || undefined,
    expiryDate: credentials.expiry_date || undefined,
  } satisfies StoredTokens;
}
