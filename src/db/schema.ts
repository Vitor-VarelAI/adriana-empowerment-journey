// Database schema types for the coaching system
// These types match the tables created in Supabase

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'client' | 'coach' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface AuthToken {
  id: string;
  user_id: string;
  token_hash: string;
  token_type: 'access' | 'refresh' | 'reset';
  expires_at: string;
  created_at: string;
  is_revoked: boolean;
}

export interface CoachProfile {
  id: string;
  user_id: string;
  specialty: string[];
  experience_years: number;
  bio?: string;
  credentials: string[];
  languages: string[];
  session_price: number;
  session_duration: number;
  availability_settings: Record<string, any>;
  cancellation_policy: string;
  is_available: boolean;
  rating: number;
  total_sessions: number;
  created_at: string;
  updated_at: string;
}

export interface CoachingSlot {
  id: string;
  coach_id: string;
  start_time: string;
  end_time: string;
  status: 'available' | 'booked' | 'cancelled' | 'blocked';
  location_type: 'online' | 'presencial' | 'hybrid';
  location_details?: string;
  max_participants: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  slot_id: string;
  client_id: string;
  coach_id: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  session_type: 'individual' | 'group' | 'package';
  client_notes?: string;
  coach_notes?: string;
  session_link?: string;
  google_calendar_event_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  client_id: string;
  amount: number;
  currency: string;
  payment_method: 'pix' | 'credit_card' | 'debit_card' | 'bank_transfer';
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  transaction_id?: string;
  payment_link?: string;
  payment_proof?: string;
  payment_date?: string;
  due_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  payment_id?: string;
  booking_id: string;
  user_id: string;
  type: 'payment' | 'refund' | 'chargeback' | 'fee';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  description?: string;
  metadata: Record<string, any>;
  created_at: string;
}

// Type guards and utilities
export const isUser = (obj: any): obj is User => {
  return obj && typeof obj.id === 'string' && typeof obj.email === 'string';
};

export const isCoachProfile = (obj: any): obj is CoachProfile => {
  return obj && typeof obj.user_id === 'string' && Array.isArray(obj.specialty);
};

export const isCoachingSlot = (obj: any): obj is CoachingSlot => {
  return obj && typeof obj.coach_id === 'string' && typeof obj.start_time === 'string';
};

export const isBooking = (obj: any): obj is Booking => {
  return obj && typeof obj.slot_id === 'string' && typeof obj.client_id === 'string';
};

// Insert types
export type NewUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type NewAuthToken = Omit<AuthToken, 'id' | 'created_at'>;
export type NewCoachProfile = Omit<CoachProfile, 'id' | 'created_at' | 'updated_at'>;
export type NewCoachingSlot = Omit<CoachingSlot, 'id' | 'created_at' | 'updated_at'>;
export type NewBooking = Omit<Booking, 'id' | 'created_at' | 'updated_at'>;
export type NewPayment = Omit<Payment, 'id' | 'created_at' | 'updated_at'>;
export type NewTransaction = Omit<Transaction, 'id' | 'created_at'>;

// Update types (partial)
export type UpdateUser = Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
export type UpdateCoachProfile = Partial<Omit<CoachProfile, 'id' | 'created_at' | 'updated_at'>>;
export type UpdateCoachingSlot = Partial<Omit<CoachingSlot, 'id' | 'created_at' | 'updated_at'>>;
export type UpdateBooking = Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>;
export type UpdatePayment = Partial<Omit<Payment, 'id' | 'created_at' | 'updated_at'>>;

// Legacy types for backward compatibility
export const oauthTokens = {
  // Legacy table - will be migrated to auth_tokens
  id: '',
  provider: 'google',
  accountEmail: '',
  refreshToken: '',
  accessToken: '',
  accessTokenExpiresAt: new Date(),
  scope: '',
  tokenType: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const legacyBookings = {
  // Legacy table structure - will be migrated
  id: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  sessionType: '',
  serviceId: 0,
  serviceName: '',
  notes: '',
  startTime: new Date(),
  endTime: new Date(),
  timeZone: '',
  calendarEventId: '',
  calendarHtmlLink: '',
  status: '',
  sentClientNotifications: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export type OAuthToken = typeof oauthTokens;
export type NewOAuthToken = typeof oauthTokens;
export type LegacyBooking = typeof legacyBookings;
export type NewLegacyBooking = typeof legacyBookings;