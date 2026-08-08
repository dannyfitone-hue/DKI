# RESTOTECH Command — Clean Operations Starter

A mobile-first property-management restoration response platform built with Next.js for GitHub + Vercel and prepared for Supabase.

## Included
- Public no-login emergency request with only property address + phone required
- Clean RESTOTECH Admin operations dashboard
- Service Team Manager dashboard
- Sales CRM for property-management accounts
- Account-owner attribution and sales-stage tracking
- Damage amount + damage description on each call
- Client-visible vs RESTOTECH-internal service updates
- Live status timeline with 5-second refresh
- Supabase schema for accounts, properties, emergencies, updates and account activity
- No sample accounts, fake emergencies, example revenue or test activity

## Deploy to Vercel
1. Push this folder to GitHub.
2. In Vercel, use Framework Preset: Next.js.
3. Leave Build Command, Output Directory and Install Command overrides OFF.
4. Root Directory should be the folder containing this package.json.
5. Create a Supabase project and run `supabase/schema.sql` in SQL Editor.
6. Add these Vercel Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
7. Redeploy.

## Important production boundary
The internal RESTOTECH admin, sales and service workflows can be tested after Supabase is connected. Before distributing client-portal logins or exposing internal dashboards to real customers/staff, add Supabase Auth, role-based access and Row Level Security so each user only sees authorized data.

## Routes
- `/` public site + emergency request
- `/admin` owner/admin operations
- `/service` service team manager
- `/sales` sales CRM
- `/client` client access landing area


## Emergency Access Flow (V3)
- Main Emergency button asks: Existing Client Number or New Client.
- Existing clients enter their RESTOTECH Client Number and open their identified client account.
- New clients submit only property address + phone number (unit/note optional).
- Every new emergency receives a private `/status/<token>` live-status link.
- Admin and Service dashboards update the emergency status and can post client-visible updates.
- The client status page refreshes automatically every 5 seconds.

## Supabase update
If this project already has the older RESTOTECH tables, run `supabase/migrate_v3.sql`.
For a fresh Supabase project, run `supabase/schema.sql`.
