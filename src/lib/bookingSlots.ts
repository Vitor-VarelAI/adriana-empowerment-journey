const SLOT_INTERVAL_MINUTES = 60;
const BUSINESS_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday
const START_HOUR = 10;
const END_HOUR = 17; // Exclusive upper bound for slot start time

export const BOOKING_TIME_ZONE = "Europe/Lisbon";

export function isBusinessDay(date: Date): boolean {
  return BUSINESS_DAYS.includes(date.getDay());
}

export function generateDailySlots(): string[] {
  const slots: string[] = [];
  for (let hour = START_HOUR; hour < END_HOUR; hour += 1) {
    const formatted = `${hour.toString().padStart(2, "0")}:00`;
    slots.push(formatted);
  }
  return slots;
}

export function isValidSlot(time: string): boolean {
  return generateDailySlots().includes(time);
}

export function isSlotInPast(date: string, time: string, timeZone: string = BOOKING_TIME_ZONE): boolean {
  const dateTime = new Date(`${date}T${time}:00`);
  const now = new Date();
  return dateTime.getTime() < now.getTime();
}

export function getSlotIntervalMinutes(): number {
  return SLOT_INTERVAL_MINUTES;
}

export function getBusinessDays(): number[] {
  return [...BUSINESS_DAYS];
}

export function getWorkingHours(): { startHour: number; endHour: number } {
  return { startHour: START_HOUR, endHour: END_HOUR };
}
