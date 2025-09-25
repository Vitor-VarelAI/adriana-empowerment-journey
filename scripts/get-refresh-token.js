import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { google } from "googleapis";

const rl = readline.createInterface({ input, output });

const clientId = process.env.GOOGLE_CLIENT_ID ?? "";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";
const redirectUri =
  process.env.GOOGLE_OAUTH_REDIRECT_URI ??
  process.env.GOOGLE_REDIRECT_URI ??
  "http://localhost:3000/auth/callback";

if (!clientId || !clientSecret) {
  throw new Error(
    "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment before running this script.",
  );
}

const oauthClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

async function main() {
  const authUrl = oauthClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });

  console.log("\nAuthorize the application by visiting this URL:\n");
  console.log(authUrl);
  console.log("\nAfter approving access, copy the authorization code and paste it below.\n");

  const code = await rl.question("Authorization code: ");
  rl.close();

  const { tokens } = await oauthClient.getToken(code.trim());

  if (!tokens.refresh_token) {
    console.warn(
      "No refresh token returned. Re-run the script with the 'consent' prompt, or revoke existing tokens in your Google account security settings.",
    );
  }

  console.log("\nAccess Token:\n", tokens.access_token ?? "<none>");
  console.log("\nRefresh Token:\n", tokens.refresh_token ?? "<none>");
  console.log("\nExpiry (ms since epoch):\n", tokens.expiry_date ?? "<unknown>");
}

main().catch((error) => {
  rl.close();
  console.error(
    "Failed to obtain tokens:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
