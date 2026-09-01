import { supabase } from '../config/supabase';
import { Hackathon, HackathonMode, Round, RoundType } from '../types/vault';
import { UnstopRegisteredEvent, UnstopRegisteredEventsSource } from '../types/unstop';

const modes: HackathonMode[] = ['Online', 'Offline', 'Hybrid'];
const roundTypes: RoundType[] = ['Quiz', 'Coding', 'PPT', 'Prototype', 'Presentation', 'Interview', 'Custom'];

const asMode = (value: unknown): HackathonMode =>
  modes.includes(value as HackathonMode) ? value as HackathonMode : 'Hybrid';

const asRound = (value: Partial<Round>, index: number): Round => ({
  id: `unstop-round-${crypto.randomUUID()}`,
  name: value.name?.trim() || `Round ${index + 1}`,
  type: roundTypes.includes(value.type as RoundType) ? value.type as RoundType : 'Custom',
  mode: asMode(value.mode),
  startDate: value.startDate || '',
  startTime: value.startTime || '',
  deadlineDate: value.deadlineDate || '',
  deadlineTime: value.deadlineTime || '',
  submissionDetails: value.submissionDetails || '',
  submissionRequirements: value.submissionRequirements || '',
  resultDate: value.resultDate || '',
  status: 'Pending',
  remarks: value.remarks || '',
  completed: false,
});

class SupabaseUnstopRegisteredEventsSource implements UnstopRegisteredEventsSource {
  async listRegisteredEvents(): Promise<UnstopRegisteredEvent[]> {
    const { data, error } = await supabase
      .from('unstop_events')
      .select('id, source_event_id, title, event_type, organizer, mode, registration_url, official_url, status, rounds')
      .order('source_updated_at', { ascending: false });

    if (error) throw new Error('Unable to load registered Unstop events.');

    return (data ?? []).map((event: Record<string, unknown>) => ({
      id: String(event.id),
      sourceEventId: String(event.source_event_id),
      title: String(event.title),
      type: String(event.event_type || 'Event'),
      organizer: String(event.organizer || ''),
      mode: modes.includes(event.mode as HackathonMode) ? event.mode as HackathonMode : undefined,
      registrationUrl: event.registration_url ? String(event.registration_url) : undefined,
      officialUrl: event.official_url ? String(event.official_url) : undefined,
      status: String(event.status || 'Registered'),
      rounds: Array.isArray(event.rounds) ? event.rounds as Array<Partial<Round>> : [],
    }));
  }
}

export const unstopRegisteredEventsSource = new SupabaseUnstopRegisteredEventsSource();

export const mapUnstopEventToHackathon = (event: UnstopRegisteredEvent): Hackathon => ({
  id: `h-unstop-${crypto.randomUUID()}`,
  name: event.title,
  type: event.type,
  organizer: event.organizer,
  mode: asMode(event.mode),
  platform: 'Unstop',
  unstopEventId: event.sourceEventId,
  websiteUrl: event.officialUrl || '',
  registrationUrl: event.registrationUrl || '',
  problemStatement: '',
  description: event.description || '',
  status: 'Upcoming',
  createdAt: new Date().toISOString(),
  rounds: event.rounds.map(asRound),
  tasks: [],
  documents: [],
  links: [],
  team: [],
  notes: [],
});
