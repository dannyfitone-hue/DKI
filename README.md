# RESTOTECH Command

Mobile-first restoration emergency request and operations MVP for Vercel + GitHub.

## Included
- Public no-login emergency request
- Existing-client quick emergency request
- Admin live emergency dashboard
- Service-manager portal with shared status updates
- Supabase-ready schema for accounts, properties, emergencies, and job updates
- Local demo fallback when Supabase is not configured

## Deploy
1. Push this folder to GitHub.
2. Create a Supabase project.
3. Run `supabase/schema.sql` in Supabase SQL Editor.
4. Add `.env.example` values to Vercel Environment Variables.
5. Import the GitHub repo into Vercel and deploy.

## Demo URLs
- `/` public emergency request
- `/client` property-management portal
- `/admin` RESTOTECH admin
- `/service` service-team manager

This first MVP leaves role pages open for workflow testing. Add authentication and RLS before real customer data.
