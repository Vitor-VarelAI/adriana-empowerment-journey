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
  preference_snapshot: Record<string, unknown>;
  last_reminder_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  customer_email: string;
  preferred_session_types: string[];
  preferred_days: string[];
  preferred_time_ranges: Array<Record<string, unknown>>;
  last_attended_at: string | null;
  reminder_opt_in: boolean;
  locale: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingEngagement {
  id: string;
  booking_id: string;
  engagement_status: string;
  attended_at: string | null;
  no_show_reason: string | null;
  follow_up_required: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReminderLog {
  id: string;
  booking_id: string;
  channel: string;
  status: string;
  send_at: string;
  sent_at: string | null;
  error_message: string | null;
  delivery_metadata: Record<string, unknown>;
  created_at: string;
}

export type NewAuthToken = Omit<AuthToken, "id" | "created_at" | "updated_at">;
export type UpdateAuthToken = Partial<NewAuthToken>;

export type NewBooking = Omit<Booking, "id" | "created_at" | "updated_at">;
export type UpdateBooking = Partial<NewBooking>;

export type NewCustomerProfile = Omit<CustomerProfile, "created_at" | "updated_at">;
export type UpdateCustomerProfile = Partial<NewCustomerProfile>;

export type NewBookingEngagement = Omit<BookingEngagement, "id" | "created_at" | "updated_at">;
export type UpdateBookingEngagement = Partial<NewBookingEngagement>;

export type NewReminderLog = Omit<ReminderLog, "id" | "created_at">;
export type UpdateReminderLog = Partial<NewReminderLog>;

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

export const isCustomerProfile = (value: unknown): value is CustomerProfile => {
  return (
    typeof value === "object" &&
    value !== null &&
    "customer_email" in value &&
    typeof (value as CustomerProfile).customer_email === "string"
  );
};

export const isBookingEngagement = (value: unknown): value is BookingEngagement => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "booking_id" in value &&
    typeof (value as BookingEngagement).id === "string" &&
    typeof (value as BookingEngagement).booking_id === "string"
  );
};

export const isReminderLog = (value: unknown): value is ReminderLog => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "booking_id" in value &&
    typeof (value as ReminderLog).id === "string" &&
    typeof (value as ReminderLog).booking_id === "string"
  );
};
