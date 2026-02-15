import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export interface CMSData {
    [key: string]: string;
}

export async function getSiteContent(): Promise<CMSData | null> {
    try {
        // Check for credentials
        const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'); // Handle newlines in env var
        const sheetId = process.env.GOOGLE_SHEETS_ID;

        if (!clientEmail || !privateKey || !sheetId) {
            console.warn('Google Sheets credentials missing. Using local defaults.');
            return null;
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'A:B', // Assumes Key in Col A, Value in Col B
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.warn('No data found in Google Sheet.');
            return null;
        }

        const data: CMSData = {};
        rows.forEach((row) => {
            // row[0] is Key, row[1] is Value
            if (row[0] && row[1]) {
                data[row[0]] = row[1]; // Removed trim() to preserve formatting if needed, or maybe trim key only
            }
        });

        return data;
    } catch (error) {
        console.error('Error fetching from Google Sheets:', error);
        return null;
    }
}

export function getLocalDefaults(): CMSData {
    try {
        const defaultsPath = path.join(process.cwd(), 'src/data/cms-defaults.json');
        const fileContent = fs.readFileSync(defaultsPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading local defaults:', error);
        return {};
    }
}
