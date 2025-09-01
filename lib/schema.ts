export interface SlotItem { title: string; desc: string }
export interface DayPlan {
  date: string;
  summary: string;
  morning: SlotItem[];
  afternoon: SlotItem[];
  evening: SlotItem[];
  weatherAlternatives: string[];
}
export interface ItineraryJson {
  destination: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  days: DayPlan[];
  generalTips: string[];
}
