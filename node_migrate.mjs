global.WebSocket = class WebSocket {};
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lfgyedtugatjckjsuvpn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zU5x6VT-AJjAY2aLoJMzmw_eRPsDYei';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const initialHackathons = [
  {
    id: 'sih-2025',
    name: 'Smart India Hackathon 2025',
    type: 'Hackathon',
    organizer: 'Ministry of Education & AICTE',
    mode: 'Hybrid',
    websiteUrl: 'https://sih.gov.in',
    registrationUrl: 'https://sih.gov.in/portal/login',
    problemStatement: 'Automated Multi-Stream Cyber Threat Detection and Encrypted Tactical Telemetry for Defense Infrastructure.',
    description: 'National grand finale hackathon solving critical public sector problem statements under high-stress evaluation.',
    status: 'In Progress',
    createdAt: '2025-10-01',
    rounds: [
      { id: 'r1', name: 'Internal Institutional Evaluation', type: 'Coding', mode: 'Offline', deadlineDate: '2025-10-15', deadlineTime: '23:59', startDate: '2025-10-01', startTime: '09:00', submissionDetails: 'Submitted PDF format of the solution.', submissionRequirements: '', resultDate: '2026-08-01', status: 'Completed', remarks: 'Cleared top spot in college selection round.', completed: true },
      { id: 'r2', name: 'Regional Nodal Evaluation', type: 'PPT', mode: 'Online', deadlineDate: '2026-07-28', deadlineTime: '18:00', startDate: '2026-07-01', startTime: '10:00', submissionDetails: 'Needs proper slide deck with architecture.', submissionRequirements: '', resultDate: '2026-08-16', status: 'Pending', remarks: 'Submit updated architecture deck and video pitch.', completed: false },
      { id: 'r3', name: 'Grand Finale Hackathon', type: 'Prototype', mode: 'Hybrid', deadlineDate: '2026-08-10', deadlineTime: '12:00', startDate: '2026-08-08', startTime: '09:00', submissionDetails: 'Working prototype demo', submissionRequirements: '', resultDate: '2026-08-30', status: 'Pending', remarks: 'Travel required to nodal center in Pune.', completed: false }
    ],
    tasks: [
      { id: 't1', title: 'Optimize PRAHARI AI video frame decoding to 60 FPS', priority: 'High', assignedMember: 'Ranjith Bala', dueDate: '2026-07-27', completed: true },
      { id: 't2', title: 'Prepare final 15-slide PDF presentation deck for SIH panel', priority: 'High', assignedMember: 'Priya Verma', dueDate: '2026-07-28', completed: false },
      { id: 't3', title: 'Audit eBPF packet capture engine under 10 Gbps load', priority: 'Medium', assignedMember: 'Karthik Rajan', dueDate: '2026-07-29', completed: false }
    ],
    documents: [
      { id: 'doc1', name: 'SIH_Problem_Statement_1492.pdf', type: 'pdf', url: '/placeholders/sih_problem_statement.pdf', size: '1.4 MB', uploadedAt: '2025-10-02', category: 'Problem Statement' },
      { id: 'doc2', name: 'SIH_Official_Rulebook_2025.pdf', type: 'pdf', url: '/placeholders/sih_rulebook.pdf', size: '2.1 MB', uploadedAt: '2025-10-02', category: 'Rulebook' },
      { id: 'doc3', name: 'SIH_Phase2_Presentation_Template.pptx', type: 'pptx', url: '/placeholders/sih_template.pptx', size: '4.8 MB', uploadedAt: '2026-07-20', category: 'PPT Template' }
    ],
    links: [
      { id: 'l1', title: 'Official SIH Portal', url: 'https://sih.gov.in', type: 'Official Website' },
      { id: 'l2', title: 'Orion Forge SIH Discord Channel', url: 'https://discord.gg/orionforge', type: 'Discord' },
      { id: 'l3', title: 'Submission Shared Drive', url: 'https://drive.google.com/drive/folders/orion', type: 'Google Drive' }
    ],
    team: [
      { id: 'tm1', memberName: 'Ranjith Bala', role: 'Team Lead & AI Architect', responsibility: 'Neural model pipeline & overall demo presentation' },
      { id: 'tm2', memberName: 'Aarav Sharma', role: 'Hardware & Telemetry Engineer', responsibility: 'Sensor integration & drone telematics' },
      { id: 'tm3', memberName: 'Priya Verma', role: 'AI Researcher & Data Engineer', responsibility: 'Dataset curation & model benchmarking' },
      { id: 'tm4', memberName: 'Karthik Rajan', role: 'Systems & Security Architect', responsibility: 'Intrusion analysis engine & network sandbox' }
    ],
    notes: [
      { id: 'n1', title: 'Panel Q&A Talking Points', content: 'Focus heavily on offline edge inferencing capabilities. Panelists will ask about zero-internet operations during natural disasters.', updatedAt: '2026-07-25' }
    ]
  },
  {
    id: 'ai-national-sprint',
    name: 'National AI Swarm Hackathon 2026',
    type: 'Hackathon',
    organizer: 'National Robotics Forum & IEEE',
    mode: 'Online',
    websiteUrl: 'https://roboticsforum.org/hackathon',
    registrationUrl: 'https://roboticsforum.org/register',
    problemStatement: 'Autonomous UAV Swarm Path Optimization & Thermal Survivor Heatmap Generation.',
    description: '48-hour online AI sprint focused on autonomous robotics and edge computing.',
    status: 'Upcoming',
    createdAt: '2026-01-10',
    rounds: [
      { id: 'r10', name: 'Abstract Submission', type: 'PPT', mode: 'Online', deadlineDate: '2026-08-05', deadlineTime: '23:59', startDate: '2026-07-01', startTime: '09:00', submissionDetails: 'Idea submission phase', submissionRequirements: '', resultDate: '2026-08-10', status: 'Pending', remarks: 'Focus on scalability.', completed: false },
      { id: 'r11', name: 'Live Code Sprint & Demo', type: 'Coding', mode: 'Online', deadlineDate: '2026-08-15', deadlineTime: '18:00', startDate: '2026-08-12', startTime: '09:00', submissionDetails: 'Final code submission', submissionRequirements: '', resultDate: '2026-08-20', status: 'Pending', remarks: 'Final presentation to judges.', completed: false }
    ],
    tasks: [
      { id: 't10', title: 'Write ROS2 swarm pathfinding node in C++', priority: 'High', assignedMember: 'Aarav Sharma', dueDate: '2026-08-01', completed: false }
    ],
    documents: [],
    links: [
      { id: 'l10', title: 'Robotics Forum Portal', url: 'https://roboticsforum.org', type: 'Official Website' }
    ],
    team: [
      { id: 'tm10', memberName: 'Aarav Sharma', role: 'Robotics Lead', responsibility: 'PX4 & ROS2 middleware' },
      { id: 'tm11', memberName: 'Ranjith Bala', role: 'AI Model Lead', responsibility: 'YOLOv11 TensorRT optimization' }
    ],
    notes: []
  }
];

const initialHistoryEntries = [
  {
    id: 'h1',
    hackathonId: 'h-id-1',
    hackathonName: 'Creatathon 2025 Innovation Challenge',
    projectName: 'UAV Disaster Management System',
    organizer: 'Creatathon Foundation',
    date: 'October 2025',
    roundsCount: 3,
    result: 'Winner',
    resultDetails: '🏆 1st Place Winner ($3,500 Cash Prize + Incubation Grant)',
    description: 'Designed and deployed an autonomous AI disaster surveillance drone fleet platform operating on thermal cameras within 36 continuous hours.',
    teamMembers: ['Ranjith Bala', 'Aarav Sharma', 'Priya Verma', 'Karthik Rajan'],
    documents: [],
    githubUrl: 'https://github.com/orionforge/uav-disaster-management',
    demoUrl: 'https://uav-demo.orionforge.ai',
    certificateUrl: '/certificates/creatathon_2025_certificate.pdf',
    gallery: [
      'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'h2',
    hackathonId: 'h-id-2',
    hackathonName: 'IEEE Embedded Intelligence Hackfest 2025',
    projectName: 'Pulse OS & Sentinel AI',
    organizer: 'IEEE Computer Society',
    date: 'November 2025',
    roundsCount: 2,
    result: 'Shortlisted',
    resultDetails: 'Paper Accepted & Published in IEEE Digital Library',
    description: 'Presented lightweight micro-kernel middleware for edge robotics, achieving sub-10 microsecond interrupt latency.',
    teamMembers: ['Ranjith Bala', 'Priya Verma', 'Karthik Rajan'],
    documents: [],
    githubUrl: 'https://github.com/orionforge/pulse-os',
    certificateUrl: '/certificates/ieee_paper_certificate.pdf',
    gallery: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

const initialNotifications = [
  { id: 'notif-1', title: 'Upcoming Deadline Tomorrow', message: 'SIH 2025 Regional Evaluation presentation submission due tomorrow at 18:00.', type: 'deadline', timestamp: '10 minutes ago', read: false, link: '#hackathons' },
  { id: 'notif-2', title: 'New Document Uploaded', message: 'Priya Verma uploaded SIH_Phase2_Presentation_Template.pptx to Document Vault.', type: 'upload', timestamp: '2 hours ago', read: false },
  { id: 'notif-3', title: 'Round 1 Automatically Closed', message: 'Internal Institutional Evaluation round deadline passed and marked as Completed.', type: 'round_closed', timestamp: 'Yesterday', read: true }
];

async function runMigration() {
  await supabase.auth.signInWithPassword({ email: 'vault@orionforge.com', password: 'varr@Forge' });

  for (const h of initialHackathons) {
    await supabase.from('hackathons').upsert({ id: h.id, name: h.name, type: h.type, organizer: h.organizer, mode: h.mode, website_url: h.websiteUrl, registration_url: h.registrationUrl, problem_statement: h.problemStatement, description: h.description, status: h.status, created_at: h.createdAt });
    
    if (h.rounds.length) await supabase.from('hackathon_rounds').upsert(h.rounds.map(r => ({ id: r.id, hackathon_id: h.id, name: r.name, type: r.type, mode: r.mode, start_date: r.startDate, start_time: r.startTime, deadline_date: r.deadlineDate, deadline_time: r.deadlineTime, submission_details: r.submissionDetails, submission_requirements: r.submissionRequirements, result_date: r.resultDate, status: r.status, remarks: r.remarks, completed: r.completed })));
    if (h.tasks.length) await supabase.from('hackathon_tasks').upsert(h.tasks.map(t => ({ id: t.id, hackathon_id: h.id, title: t.title, priority: t.priority, assigned_member: t.assignedMember, due_date: t.dueDate, completed: t.completed })));
    if (h.documents.length) await supabase.from('hackathon_documents').upsert(h.documents.map(d => ({ id: d.id, hackathon_id: h.id, name: d.name, type: d.type, url: d.url, size: d.size, uploaded_at: d.uploadedAt, category: d.category })));
    if (h.links.length) await supabase.from('hackathon_links').upsert(h.links.map(l => ({ id: l.id, hackathon_id: h.id, title: l.title, url: l.url, type: l.type })));
    if (h.team.length) await supabase.from('hackathon_team').upsert(h.team.map(t => ({ id: t.id, hackathon_id: h.id, member_name: t.memberName, role: t.role, responsibility: t.responsibility })));
    if (h.notes.length) await supabase.from('hackathon_notes').upsert(h.notes.map(n => ({ id: n.id, hackathon_id: h.id, title: n.title, content: n.content, updated_at: n.updatedAt })));
  }

  for (const entry of initialHistoryEntries) {
    await supabase.from('vault_history').upsert({ id: entry.id, hackathon_id: entry.hackathonId, hackathon_name: entry.hackathonName, project_name: entry.projectName, organizer: entry.organizer, date: entry.date, rounds_count: entry.roundsCount, result: entry.result, result_details: entry.resultDetails, description: entry.description, problem_statement: entry.problemStatement, team_members: entry.teamMembers, rounds: entry.rounds, documents: entry.documents, github_url: entry.githubUrl, demo_url: entry.demoUrl, video_url: entry.videoUrl, certificate_url: entry.certificateUrl, certificates: entry.certificates, ppt_url: entry.pptUrl, gallery: entry.gallery, overview: entry.overview, round_results: entry.roundResults, project_links: entry.projectLinks, hackathon_links: entry.hackathonLinks });
  }

  await supabase.from('vault_notifications').upsert(initialNotifications.map(n => ({ id: n.id, title: n.title, message: n.message, type: n.type, timestamp: n.timestamp, read: n.read, link: n.link })));

  console.log('Migration done!');
}

runMigration().catch(console.error);
