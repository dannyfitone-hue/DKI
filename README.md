# DKI Restotech Property Management Response Platform — V6

This build is organized around one shared live Client/Job File and three controlled dashboards.

## Final workflow
1. Property manager submits an emergency or non-emergency request.
2. A Client/Job File is created automatically.
3. Admin receives the request in the live queue.
4. Admin accepts the request, adds internal information, and assigns a Service Team.
5. Only after assignment does that file appear on the selected Service Team Dashboard.
6. Service Team can call the client, navigate to the property, read Admin notes, and update field status.
7. Admin sees field updates in the same shared file.
8. The client sees only client-approved status and updates.
9. New clients without a Client Number receive a private live status link.

## Dashboards
- `/admin` — DKI Restotech Admin Command Center
- `/client` — Property Management Client Dashboard
- `/service` — Service Team Dashboard (assigned files only)

`/sales` now redirects to `/admin`; CRM/client account management is a tab inside Admin.

## Live communication
Install and configure:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The dashboards subscribe to Supabase Realtime when the public URL + anon key are available. A polling fallback is included.

## Supabase
Fresh database: run `supabase/schema.sql`.

Existing V3/V5 database: run `supabase/migrate_v6.sql`.

## Important production security step
This operational starter intentionally uses Client Numbers and Team Access Codes for workflow testing. Before broadly exposing real sensitive customer data, add Supabase Auth and strict Row Level Security for Admin, Client, and Service Team roles.

## Deployment
1. Upload/push this project to GitHub.
2. In Vercel choose Framework Preset: Next.js.
3. Leave Output Directory override OFF.
4. Add all three environment variables above.
5. Deploy.
