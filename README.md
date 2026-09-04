# Cub Scout Pack 269 Website

Static website for Cub Scout Pack 269 (Fremont, CA - Golden Gate Area Council, Mission Peak District).
No build step, no server, nothing to compile. GitHub Pages serves the files as-is.

## Structure
- index.html, about.html, events.html, news.html, enroll.html, forms.html, faq.html, contact.html, 404.html
- assets/css/style.css - styling
- assets/js/config.js - single switch between static JSON and a future backend
- assets/js/data.js - data-access layer every page calls through (Pack269Data.get(collection))
- assets/js/main.js - renders each page's content
- assets/data/*.json - the actual content: dens, news, activities, events, faq
- assets/img/logo.svg - Pack 269 logo (SVG wrapper around the pack's official artwork), used in the nav
- assets/img/favicon.svg - browser tab icon, cropped from the same logo

## Updating content today (v1, static)
Edit the relevant file in assets/data/ and commit. No HTML/CSS/JS changes needed.

## Adding a backend later (v2)
1. Provision a Supabase project.
2. Create one table per collection (dens, news, activities, events, faq) matching the JSON fields.
3. Enable Row Level Security with public read-only access for the anon role.
4. Migrate the JSON rows into the tables.
5. In assets/js/config.js, set mode: "supabase" and fill in url/anonKey.
6. Build an admin UI (Supabase Studio, or a small authenticated app) for editing rows.

Never put a service_role key in this repo or client-side code - anon/publishable key only, with RLS restricting it to read-only.

## Open TODO: live calendar embed
events.html currently only shows a static district-events table and points enrolled families to
Scoutbook for the real calendar (Scoutbook calendars aren't publicly embeddable outside the platform).
If Pack 269 wants a directly embedded calendar like some other packs use, we need one of:
- A public Google Calendar embed URL / calendar ID (format: xxxxx@group.calendar.google.com), which
  can then be dropped into an iframe in events.html, OR
- Confirmation that Scoutbook is genuinely the only calendar source, in which case this TODO is closed
  as "won't do" since there's nothing public to embed.
Do not guess or fabricate a calendar ID here - a wrong one silently shows someone else's calendar or a blank iframe.

## Content source
Copy is sourced from the live Pack 269 site (pack269.org) as of September 2026. Application form links
point back to pack269.org rather than a guessed file path since exact PDF URLs weren't available at build time.
