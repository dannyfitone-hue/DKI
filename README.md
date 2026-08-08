# RESTOTECH Command — V2
A mobile-first property management restoration response platform built with Next.js for GitHub + Vercel and prepared for Supabase.

## V2 modules
- Public no-login emergency request: only property address + phone required
- Registered property manager portal with fast emergency request
- RESTOTECH Admin operations dashboard
- Service Team Manager dashboard
- Sales CRM for property-management accounts
- Account owner attribution and sales-stage tracking
- Damage amount + damage description on each call
- Client-visible vs RESTOTECH-internal service updates
- Live status timeline with 5-second refresh
- Supabase schema for accounts, properties, emergencies, updates and account activity

## Run locally
```bash
npm install
npm run dev
```

## Deploy to Vercel
1. Upload/push this folder to a new GitHub repository.
2. In Supabase, create a project and run `supabase/schema.sql` in SQL Editor.
3. In Supabase project settings, copy Project URL and service-role key.
4. In Vercel Project Settings → Environment Variables add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Import the GitHub repository into Vercel and deploy.

Without those environment variables the app runs in demo-memory mode, so you can inspect the design and workflow first.

## Demo routes
- `/` public site + emergency button
- `/client` property manager portal
- `/admin` owner/admin dashboard
- `/service` service team manager
- `/sales` sales CRM

## Before production
Add Supabase Auth + role-based permissions, RLS, real SMS/push notifications, technician assignment, file uploads, audit history, and client-property scoping. Never expose the service-role key to browser code.