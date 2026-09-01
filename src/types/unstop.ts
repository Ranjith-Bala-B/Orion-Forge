import { HackathonMode, HackathonType, Round } from './vault';

export interface UnstopRegisteredEvent {
  id: string;
  sourceEventId: string;
  title: string;
  type: HackathonType;
  organizer: string;
  mode?: HackathonMode;
  registrationUrl?: string;
  officialUrl?: string;
  status: string;
  description?: string;
  logoUrl?: string;
  rounds: Array<Partial<Round>>;
}

/**
 * A server-side approved provider writes normalized events to Supabase. The
 * browser only reads those records; it never receives Unstop credentials.
 */
export interface UnstopRegisteredEventsSource {
  listRegisteredEvents(): Promise<UnstopRegisteredEvent[]>;
}
