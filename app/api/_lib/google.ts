import { google } from "googleapis";
import { supabase } from "@/db/client";

export type StoredTokens = {
  accessToken?: string | null;
  refreshToken?: string | null;
  expiryDate?: number | null;
  scope?: string | null;
  tokenType?: string | null;
  accountEmail?: string | null;
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
  return `${siteUrl.replace(/\/$/, "")}/auth/google/callback`;
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
  const adminEmail = assertEnv("ADMIN_EMAIL", process.env.ADMIN_EMAIL);
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

function getTokenKey(config: GoogleConfig, accountEmail?: string | null): string {
  return accountEmail || config.adminEmail || config.calendarId || "default";
}

async function persistTokensToDatabase(
  config: GoogleConfig,
  tokens: StoredTokens,
) {
  const email = tokens.accountEmail || config.adminEmail;
  if (!email || !tokens.refreshToken) {
    return;
  }

  const updatePayload = {
    provider: "google" as const,
    accountEmail: email,
    refreshToken: tokens.refreshToken,
    accessToken: tokens.accessToken ?? null,
    accessTokenExpiresAt: tokens.expiryDate ? new Date(tokens.expiryDate) : null,
    scope: tokens.scope ?? null,
    tokenType: tokens.tokenType ?? null,
    updatedAt: new Date(),
  };

  const { data: existingToken, error: selectError } = await supabase
    .from('auth_tokens')
    .select('id')
    .eq('account_email', email)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    console.error('Error checking existing token:', selectError);
    return;
  }

  const tokenData = {
    provider: 'google',
    account_email: email,
    refresh_token: updatePayload.refreshToken,
    access_token: updatePayload.accessToken,
    access_token_expires_at: updatePayload.accessTokenExpiresAt
      ? updatePayload.accessTokenExpiresAt.toISOString()
      : null,
    scope: updatePayload.scope,
    token_type: updatePayload.tokenType,
    updated_at: updatePayload.updatedAt.toISOString(),
    created_at: updatePayload.updatedAt.toISOString(),
  };

  if (existingToken) {
    // Update existing token
    const { error: updateError } = await supabase
      .from('auth_tokens')
      .update(tokenData)
      .eq('account_email', email);
    if (updateError) {
      console.error('Error updating OAuth token:', updateError);
    }
  } else {
    // Insert new token
    const { error: insertError } = await supabase
      .from('auth_tokens')
      .insert([tokenData]);
    if (insertError) {
      console.error('Error inserting OAuth token:', insertError);
    }
  }
}

export async function saveTokens(
  config: GoogleConfig,
  tokens: StoredTokens,
) {
  const key = getTokenKey(config, tokens.accountEmail);
  const existing = tokenStore.get(key) || {};
  const merged: StoredTokens = {
    ...existing,
    ...tokens,
  };

  tokenStore.set(key, merged);
  try {
    await persistTokensToDatabase(config, merged);
  } catch (error) {
    console.error("Persisting OAuth tokens failed", {
      message: error instanceof Error ? error.message : error,
      error,
    });
  }
}

async function getTokensFromDatabase(
  config: GoogleConfig,
  accountEmail?: string | null,
): Promise<StoredTokens | null> {
  const email = accountEmail || config.adminEmail;
  if (!email) {
    return null;
  }

  const { data: row, error } = await supabase
    .from('auth_tokens')
    .select('*')
    .eq('account_email', email)
    .single();

  if (error || !row) {
    return null;
  }

  return {
    accountEmail: row.account_email,
    refreshToken: row.refresh_token,
    accessToken: row.access_token ?? undefined,
    expiryDate: row.access_token_expires_at
      ? new Date(row.access_token_expires_at).getTime()
      : undefined,
    scope: row.scope ?? undefined,
    tokenType: row.token_type ?? undefined,
  };
}

export async function getStoredTokens(
  config: GoogleConfig,
  accountEmail?: string | null,
): Promise<StoredTokens | null> {
  if (config.refreshToken) {
    return { refreshToken: config.refreshToken };
  }

  const key = getTokenKey(config, accountEmail);
  const fromMemory = tokenStore.get(key);
  if (fromMemory?.refreshToken) {
    return fromMemory;
  }

  const fromDb = await getTokensFromDatabase(config, accountEmail);
  if (fromDb) {
    tokenStore.set(key, fromDb);
    return fromDb;
  }

  return null;
}

export function createOAuthClient(config: GoogleConfig) {
  return new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri,
  );
}

export async function getAuthorizedCalendar(config: GoogleConfig) {
  const tokens = await getStoredTokens(config);
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

export function extractStoredTokens(
  oAuthClient: ReturnType<typeof createOAuthClient>,
  accountEmail?: string,
) {
  const credentials = oAuthClient.credentials;
  if (!credentials) {
    return null;
  }

  return {
    accessToken: credentials.access_token || undefined,
    refreshToken: credentials.refresh_token || undefined,
    expiryDate: credentials.expiry_date || undefined,
    scope: credentials.scope,
    tokenType: credentials.token_type,
    accountEmail: accountEmail ?? undefined,
  } satisfies StoredTokens;
}
