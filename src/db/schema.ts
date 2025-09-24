export interface AuthToken {
  id: string;
  provider: string;
  account_email: string;
  refresh_token: string;
  access_token: string | null;
  access_token_expires_at: string | null;
  scope: string | null;
  token_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  session_type: string;
  service_id: number | null;
  service_name: string | null;
  notes: string | null;
  start_time: string;
  end_time: string;
  time_zone: string;
  calendar_event_id: string | null;
  calendar_html_link: string | null;
  status: string;
  sent_client_notifications: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type NewAuthToken = Omit<AuthToken, "id" | "created_at" | "updated_at">;
export type UpdateAuthToken = Partial<NewAuthToken>;

export type NewBooking = Omit<Booking, "id" | "created_at" | "updated_at">;
export type UpdateBooking = Partial<NewBooking>;

export const isAuthToken = (value: unknown): value is AuthToken => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "account_email" in value &&
    typeof (value as AuthToken).id === "string" &&
    typeof (value as AuthToken).account_email === "string"
  );
};

export const isBooking = (value: unknown): value is Booking => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "customer_email" in value &&
    typeof (value as Booking).id === "string" &&
    typeof (value as Booking).customer_email === "string"
  );
};
