# Unstop registered-events integration

Orion Forge does not log into Unstop, scrape a signed-in Unstop session, or store Unstop passwords, cookies, tokens, or API keys in the browser. The Vault reads normalized rows from the Supabase `unstop_events` table and imports a selected row into the existing `hackathons` and `hackathon_rounds` tables.

## Required setup

1. Run `supabase/vault_schema.sql` in the Supabase SQL editor. It adds `platform` and `unstop_event_id` to `hackathons`, creates `unstop_events`, enables its RLS, and adds it to Realtime.
2. Obtain an approved Unstop integration method (for example, a documented partner API with explicit permission).
3. Run that integration on a server, Supabase Edge Function, or other protected environment. Keep the Unstop credential there as a server-only secret.
4. Normalize approved source data into `unstop_events`. `source_event_id` must be stable and unique; use Unstop's event ID when supplied, otherwise generate a stable provider-side key from an approved canonical event URL. Store only fields actually received. Put rounds in `rounds` using the existing Vault keys such as `name`, `type`, `mode`, `startDate`, `startTime`, `deadlineDate`, `deadlineTime`, `submissionDetails`, `submissionRequirements`, and `resultDate`.

The frontend must have only its existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Do not add Unstop secrets to a `VITE_*` variable.

## Current limitation

No documented public Unstop API for an individual account's registered events was found. Until Unstop grants an approved API/export/integration route, the panel intentionally shows an empty state. The untracked local `scrape_unstop.cjs` experiment is not used by this feature and should not be committed or deployed.
