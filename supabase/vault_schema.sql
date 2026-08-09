-- Create the tables for Orion Forge Vault

-- 2. hackathons
CREATE TABLE IF NOT EXISTS hackathons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    organizer TEXT,
    mode TEXT,
    website_url TEXT,
    registration_url TEXT,
    problem_statement TEXT,
    description TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_game_over BOOLEAN DEFAULT false
);

-- 3. hackathon_rounds
CREATE TABLE IF NOT EXISTS hackathon_rounds (
    id TEXT PRIMARY KEY,
    hackathon_id TEXT REFERENCES hackathons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    mode TEXT,
    start_date DATE,
    start_time TIME,
    deadline_date DATE,
    deadline_time TIME,
    submission_details TEXT,
    submission_requirements TEXT,
    result_date DATE,
    status TEXT,
    remarks TEXT,
    completed BOOLEAN DEFAULT false
);

-- 4. hackathon_tasks
CREATE TABLE IF NOT EXISTS hackathon_tasks (
    id TEXT PRIMARY KEY,
    hackathon_id TEXT REFERENCES hackathons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    priority TEXT,
    assigned_member TEXT,
    due_date DATE,
    completed BOOLEAN DEFAULT false
);

-- 5. hackathon_documents
CREATE TABLE IF NOT EXISTS hackathon_documents (
    id TEXT PRIMARY KEY,
    hackathon_id TEXT REFERENCES hackathons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    url TEXT NOT NULL,
    size TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE,
    category TEXT
);

-- 6. hackathon_links
CREATE TABLE IF NOT EXISTS hackathon_links (
    id TEXT PRIMARY KEY,
    hackathon_id TEXT REFERENCES hackathons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT
);

-- 7. hackathon_team
CREATE TABLE IF NOT EXISTS hackathon_team (
    id TEXT PRIMARY KEY,
    hackathon_id TEXT REFERENCES hackathons(id) ON DELETE CASCADE,
    member_name TEXT NOT NULL,
    role TEXT,
    responsibility TEXT
);

-- 8. hackathon_notes
CREATE TABLE IF NOT EXISTS hackathon_notes (
    id TEXT PRIMARY KEY,
    hackathon_id TEXT REFERENCES hackathons(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 9. vault_history
CREATE TABLE IF NOT EXISTS vault_history (
    id TEXT PRIMARY KEY,
    hackathon_id TEXT,
    hackathon_name TEXT NOT NULL,
    project_name TEXT NOT NULL,
    organizer TEXT,
    date TEXT,
    rounds_count INTEGER,
    result TEXT,
    result_details TEXT,
    description TEXT,
    problem_statement TEXT,
    team_members JSONB,
    rounds JSONB,
    documents JSONB,
    github_url TEXT,
    demo_url TEXT,
    video_url TEXT,
    certificate_url TEXT,
    certificates JSONB,
    ppt_url TEXT,
    gallery JSONB,
    overview TEXT,
    round_results JSONB,
    project_links JSONB,
    hackathon_links JSONB
);

-- 10. vault_notifications
CREATE TABLE IF NOT EXISTS vault_notifications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT,
    timestamp TEXT,
    read BOOLEAN DEFAULT false,
    link TEXT
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_notifications ENABLE ROW LEVEL SECURITY;

DO $$ 
DECLARE
    t TEXT;
    tables TEXT[] := ARRAY['hackathons', 'hackathon_rounds', 'hackathon_tasks', 'hackathon_documents', 'hackathon_links', 'hackathon_team', 'hackathon_notes', 'vault_history', 'vault_notifications'];
BEGIN
    FOREACH t IN ARRAY tables
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated full access" ON %I;', t);
        EXECUTE format('CREATE POLICY "Allow authenticated full access" ON %I FOR ALL TO authenticated USING (auth.role() = ''authenticated'') WITH CHECK (auth.role() = ''authenticated'');', t);
    END LOOP;
END $$;

-- Set up Realtime replication safely
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END
$$;

DO $$
DECLARE
    t TEXT;
    tables TEXT[] := ARRAY['hackathons', 'hackathon_rounds', 'hackathon_tasks', 'hackathon_documents', 'hackathon_links', 'hackathon_team', 'hackathon_notes', 'vault_history', 'vault_notifications'];
BEGIN
    FOREACH t IN ARRAY tables
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = t
        ) THEN
            EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I;', t);
        END IF;
    END LOOP;
END $$;
