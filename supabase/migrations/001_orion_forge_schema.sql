CREATE TABLE IF NOT EXISTS public.site_config (
    "id" integer,
    "name" text,
    "tagline" text,
    "description" text,
    "email" text,
    "year" integer,
    "socials" jsonb,
    "about" jsonb,
    "hero" jsonb
);

ALTER TABLE public.site_config ADD CONSTRAINT single_row CHECK ((id = 1));
ALTER TABLE public.site_config ADD CONSTRAINT site_config_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS site_config_pkey ON public.site_config USING btree (id);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public delete access" ON public.site_config
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.site_config
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.site_config
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.site_config
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.team_members (
    "id" text,
    "name" text,
    "role" text,
    "avatar_url" text,
    "bio" text,
    "detailed_about" text,
    "email" text,
    "phone" text,
    "socials" jsonb,
    "skills" text[],
    "experience" text[],
    "projects" text[],
    "cv_url" text
);

ALTER TABLE public.team_members ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS team_members_pkey ON public.team_members USING btree (id);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public delete access" ON public.team_members
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.team_members
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.team_members
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.team_members
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.projects (
    "id" text,
    "name" text,
    "category" text,
    "short_description" text,
    "problem_statement" text,
    "solution" text,
    "features" text[],
    "tech_stack" text[],
    "architecture_diagram_url" text,
    "results_impact" text,
    "thumbnail_url" text,
    "cover_image_url" text,
    "gallery" text[],
    "links" jsonb
);

ALTER TABLE public.projects ADD CONSTRAINT projects_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS projects_pkey ON public.projects USING btree (id);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public delete access" ON public.projects
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.projects
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.projects
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.projects
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.achievements (
    "id" text,
    "title" text,
    "event" text,
    "date" text,
    "badge" text,
    "description" text,
    "full_description" text,
    "image_url" text,
    "certificate_preview_url" text,
    "certificate_download_url" text,
    "gallery" text[],
    "team_members" text[]
);

ALTER TABLE public.achievements ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS achievements_pkey ON public.achievements USING btree (id);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public delete access" ON public.achievements
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.achievements
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.achievements
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.achievements
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.stats (
    "id" text,
    "label" text,
    "value" text,
    "suffix" text,
    "description" text,
    "icon_name" text
);

ALTER TABLE public.stats ADD CONSTRAINT stats_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS stats_pkey ON public.stats USING btree (id);

ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public delete access" ON public.stats
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.stats
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.stats
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.stats
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.timeline (
    "id" text,
    "year" text,
    "title" text,
    "subtitle" text,
    "description" text,
    "tag" text,
    "highlight" boolean
);

ALTER TABLE public.timeline ADD CONSTRAINT timeline_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS timeline_pkey ON public.timeline USING btree (id);

ALTER TABLE public.timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public delete access" ON public.timeline
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.timeline
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.timeline
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.timeline
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.history_entries (
    "id" text,
    "hackathon_id" text,
    "hackathon_name" text,
    "project_name" text,
    "organizer" text,
    "date" text,
    "rounds_count" integer,
    "result" text,
    "result_details" text,
    "description" text,
    "problem_statement" text,
    "github_url" text,
    "demo_url" text,
    "video_url" text,
    "certificate_url" text,
    "ppt_url" text,
    "overview" text,
    "team_members" jsonb,
    "gallery" jsonb,
    "round_results" jsonb,
    "project_links" jsonb,
    "hackathon_links" jsonb,
    "certificates" jsonb,
    "documents" jsonb,
    "rounds" jsonb
);

ALTER TABLE public.history_entries ADD CONSTRAINT history_entries_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS history_entries_pkey ON public.history_entries USING btree (id);
CREATE INDEX IF NOT EXISTS idx_history_entries_hid ON public.history_entries USING btree (hackathon_id);

ALTER TABLE public.history_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public delete access" ON public.history_entries
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.history_entries
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.history_entries
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.history_entries
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.hackathons (
    "id" text,
    "name" text,
    "type" text,
    "organizer" text,
    "mode" text,
    "website_url" text,
    "registration_url" text,
    "problem_statement" text,
    "description" text,
    "status" text,
    "created_at" text,
    "is_game_over" boolean
);

ALTER TABLE public.hackathons ADD CONSTRAINT hackathons_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS hackathons_pkey ON public.hackathons USING btree (id);

ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access" ON public.hackathons
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING ((auth.role() = 'authenticated'::text))
    WITH CHECK ((auth.role() = 'authenticated'::text))
;

CREATE POLICY "Allow public delete access" ON public.hackathons
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.hackathons
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.hackathons
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.hackathons
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.hackathon_rounds (
    "id" text,
    "hackathon_id" text,
    "name" text,
    "type" text,
    "mode" text,
    "start_date" text,
    "start_time" text,
    "deadline_date" text,
    "deadline_time" text,
    "submission_details" text,
    "submission_requirements" text,
    "result_date" text,
    "status" text,
    "remarks" text,
    "completed" boolean
);

ALTER TABLE public.hackathon_rounds ADD CONSTRAINT hackathon_rounds_hackathon_id_fkey FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON DELETE CASCADE;
ALTER TABLE public.hackathon_rounds ADD CONSTRAINT hackathon_rounds_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS hackathon_rounds_pkey ON public.hackathon_rounds USING btree (id);
CREATE INDEX IF NOT EXISTS idx_hackathon_rounds_hid ON public.hackathon_rounds USING btree (hackathon_id);

ALTER TABLE public.hackathon_rounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access" ON public.hackathon_rounds
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING ((auth.role() = 'authenticated'::text))
    WITH CHECK ((auth.role() = 'authenticated'::text))
;

CREATE POLICY "Allow public delete access" ON public.hackathon_rounds
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.hackathon_rounds
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.hackathon_rounds
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.hackathon_rounds
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.hackathon_tasks (
    "id" text,
    "hackathon_id" text,
    "title" text,
    "priority" text,
    "assigned_member" text,
    "due_date" text,
    "completed" boolean
);

ALTER TABLE public.hackathon_tasks ADD CONSTRAINT hackathon_tasks_hackathon_id_fkey FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON DELETE CASCADE;
ALTER TABLE public.hackathon_tasks ADD CONSTRAINT hackathon_tasks_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS hackathon_tasks_pkey ON public.hackathon_tasks USING btree (id);
CREATE INDEX IF NOT EXISTS idx_hackathon_tasks_hid ON public.hackathon_tasks USING btree (hackathon_id);

ALTER TABLE public.hackathon_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access" ON public.hackathon_tasks
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING ((auth.role() = 'authenticated'::text))
    WITH CHECK ((auth.role() = 'authenticated'::text))
;

CREATE POLICY "Allow public delete access" ON public.hackathon_tasks
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.hackathon_tasks
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.hackathon_tasks
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.hackathon_tasks
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.hackathon_documents (
    "id" text,
    "hackathon_id" text,
    "name" text,
    "type" text,
    "url" text,
    "size" text,
    "uploaded_at" text,
    "category" text
);

ALTER TABLE public.hackathon_documents ADD CONSTRAINT hackathon_documents_hackathon_id_fkey FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON DELETE CASCADE;
ALTER TABLE public.hackathon_documents ADD CONSTRAINT hackathon_documents_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS hackathon_documents_pkey ON public.hackathon_documents USING btree (id);
CREATE INDEX IF NOT EXISTS idx_hackathon_docs_hid ON public.hackathon_documents USING btree (hackathon_id);

ALTER TABLE public.hackathon_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access" ON public.hackathon_documents
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING ((auth.role() = 'authenticated'::text))
    WITH CHECK ((auth.role() = 'authenticated'::text))
;

CREATE POLICY "Allow public delete access" ON public.hackathon_documents
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.hackathon_documents
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.hackathon_documents
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.hackathon_documents
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.hackathon_links (
    "id" text,
    "hackathon_id" text,
    "title" text,
    "url" text,
    "type" text
);

ALTER TABLE public.hackathon_links ADD CONSTRAINT hackathon_links_hackathon_id_fkey FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON DELETE CASCADE;
ALTER TABLE public.hackathon_links ADD CONSTRAINT hackathon_links_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS hackathon_links_pkey ON public.hackathon_links USING btree (id);
CREATE INDEX IF NOT EXISTS idx_hackathon_links_hid ON public.hackathon_links USING btree (hackathon_id);

ALTER TABLE public.hackathon_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access" ON public.hackathon_links
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING ((auth.role() = 'authenticated'::text))
    WITH CHECK ((auth.role() = 'authenticated'::text))
;

CREATE POLICY "Allow public delete access" ON public.hackathon_links
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.hackathon_links
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.hackathon_links
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.hackathon_links
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.hackathon_team (
    "id" text,
    "hackathon_id" text,
    "member_name" text,
    "role" text,
    "responsibility" text
);

ALTER TABLE public.hackathon_team ADD CONSTRAINT hackathon_team_hackathon_id_fkey FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON DELETE CASCADE;
ALTER TABLE public.hackathon_team ADD CONSTRAINT hackathon_team_pkey PRIMARY KEY (id);

CREATE INDEX IF NOT EXISTS idx_hackathon_team_hid ON public.hackathon_team USING btree (hackathon_id);
CREATE UNIQUE INDEX IF NOT EXISTS hackathon_team_pkey ON public.hackathon_team USING btree (id);

ALTER TABLE public.hackathon_team ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access" ON public.hackathon_team
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING ((auth.role() = 'authenticated'::text))
    WITH CHECK ((auth.role() = 'authenticated'::text))
;

CREATE POLICY "Allow public delete access" ON public.hackathon_team
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.hackathon_team
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.hackathon_team
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.hackathon_team
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.hackathon_notes (
    "id" text,
    "hackathon_id" text,
    "title" text,
    "content" text,
    "updated_at" text
);

ALTER TABLE public.hackathon_notes ADD CONSTRAINT hackathon_notes_hackathon_id_fkey FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON DELETE CASCADE;
ALTER TABLE public.hackathon_notes ADD CONSTRAINT hackathon_notes_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS hackathon_notes_pkey ON public.hackathon_notes USING btree (id);
CREATE INDEX IF NOT EXISTS idx_hackathon_notes_hid ON public.hackathon_notes USING btree (hackathon_id);

ALTER TABLE public.hackathon_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access" ON public.hackathon_notes
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING ((auth.role() = 'authenticated'::text))
    WITH CHECK ((auth.role() = 'authenticated'::text))
;

CREATE POLICY "Allow public delete access" ON public.hackathon_notes
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING (true)
;

CREATE POLICY "Allow public insert access" ON public.hackathon_notes
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Allow public read access" ON public.hackathon_notes
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Allow public update access" ON public.hackathon_notes
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (true)
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.vault_history (
    "id" text,
    "hackathon_id" text,
    "hackathon_name" text,
    "project_name" text,
    "organizer" text,
    "date" text,
    "rounds_count" integer,
    "result" text,
    "result_details" text,
    "description" text,
    "problem_statement" text,
    "team_members" jsonb,
    "rounds" jsonb,
    "documents" jsonb,
    "github_url" text,
    "demo_url" text,
    "video_url" text,
    "certificate_url" text,
    "certificates" jsonb,
    "ppt_url" text,
    "gallery" jsonb,
    "overview" text,
    "round_results" jsonb,
    "project_links" jsonb,
    "hackathon_links" jsonb
);

ALTER TABLE public.vault_history ADD CONSTRAINT vault_history_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS vault_history_pkey ON public.vault_history USING btree (id);

ALTER TABLE public.vault_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access" ON public.vault_history
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING ((auth.role() = 'authenticated'::text))
    WITH CHECK ((auth.role() = 'authenticated'::text))
;

-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.vault_notifications (
    "id" text,
    "title" text,
    "message" text,
    "type" text,
    "timestamp" text,
    "read" boolean,
    "link" text
);

ALTER TABLE public.vault_notifications ADD CONSTRAINT vault_notifications_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS vault_notifications_pkey ON public.vault_notifications USING btree (id);

ALTER TABLE public.vault_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access" ON public.vault_notifications
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING ((auth.role() = 'authenticated'::text))
    WITH CHECK ((auth.role() = 'authenticated'::text))
;

-- -----------------------------------------------------

