# A1 Windows — Project Roadmap

Consolidated plan for migrating the A1 Windows site from a hand-coded static HTML page on GitHub Pages to a full 11ty-based static site on Cloudflare Pages, with a blog system, Workiz CRM integration, and SEO improvements.

Steps are ordered by execution sequence. Each step lists its deliverable and any dependencies/blockers.

---

## Phase 1 — Architecture migration (foundation)

### Step 1. Scaffold 11ty inside the existing repo
- [ ] Add `@11ty/eleventy` as a dev dependency
- [ ] Create `.eleventy.js` config (input dir, output dir, passthrough copy for `images/` and `css/`)
- [ ] Create `src/` folder and move existing files into it
- [ ] Update `tailwind.config.js` content paths to scan `src/**/*.{njk,md,html}`
- [ ] Update `package.json` scripts: `dev` (11ty serve + tailwind watch in parallel), `build` (11ty + tailwind build)
- [ ] Add `_site/` to `.gitignore`

**Deliverable:** `npm run dev` boots a local server with hot reload; site looks identical to current.

### Step 2. Refactor `index.html` into 11ty templates
- [ ] Extract `<head>`, navbar, footer into reusable partials/layouts (`base.njk`, `_includes/navbar.njk`, `_includes/footer.njk`)
- [ ] Convert homepage body into `src/index.njk` referencing `base.njk`
- [ ] Verify built output is visually identical to the current `index.html`

**Deliverable:** homepage works exactly the same, but built from templates.

---

## Phase 2 — Blog system

### Step 3. Build blog infrastructure
- [ ] Create `src/_includes/layouts/post.njk` (post wrapper with hero, title, date, body, footer CTA)
- [ ] Create `src/blog/index.njk` (blog landing page that auto-lists all posts using 11ty collections)
- [ ] Configure permalinks: `/blog/:slug/`
- [ ] Add nav link to `/blog/` in the navbar
- [ ] Add `eleventy-plugin-rss` and generate `/feed.xml`
- [ ] Add a `sitemap.xml` template

**Deliverable:** `/blog/` page exists, lists posts (empty for now), matches site theme.

### Step 4. Write the first sample post end-to-end
- [ ] Pick topic (TBD with user)
- [ ] Write one real post as a `.md` file with frontmatter
- [ ] Include hero image reference, internal links back to homepage CTAs, proper metadata
- [ ] Verify it shows up in the blog index, has clean URL, renders correctly

**Deliverable:** one live blog post ready for review.

---

## Phase 3 — Hosting migration

### Step 5. Set up Cloudflare Pages deployment
- [ ] Provide step-by-step instructions for connecting GitHub repo to Cloudflare Pages (build command, output directory, env vars)
- [ ] User executes the dashboard steps (Claude cannot access Cloudflare account)
- [ ] First deploy to `a1windows.pages.dev` (free Cloudflare-provided URL) for verification

**Deliverable:** site live on Cloudflare Pages, building automatically on every push.

### Step 6. Point custom domain at Cloudflare
*Triggered when user is ready to cut over from WordPress.*
- [ ] Update DNS records / nameservers
- [ ] Verify HTTPS, redirects, www handling

**Deliverable:** `a1windows.com` resolves to the Cloudflare Pages site.

---

## Phase 4 — Form → Workiz CRM integration

### Step 7. Verify Workiz API capabilities
- [ ] Fetch live Workiz API docs to confirm current endpoint, auth method, and lead-creation payload shape
- [ ] Identify which custom fields/tags should be set on inbound leads

**Deliverable:** confirmed API contract — no guessing.

### Step 8. Build the form handler as a Cloudflare Pages Function
- [ ] Create `functions/api/quote.js`
- [ ] Implement: validation → honeypot check → Workiz API call → response
- [ ] Store `WORKIZ_API_TOKEN` as a Cloudflare environment variable (user sets in dashboard)
- [ ] Update `js/main.js` to handle the new response shape if needed

**Deliverable:** form submissions land as leads in Workiz.
**Blocked by:** user providing Workiz API token.

### Step 9. Add spam protection
- [ ] Add honeypot field to the form
- [ ] Integrate Cloudflare Turnstile (free, invisible CAPTCHA)
- [ ] Add basic rate limiting via Cloudflare WAF rule

**Deliverable:** form is hardened against bot spam.

---

## Phase 5 — SEO & polish

*Folded in from earlier code review. Can run in parallel with Phase 1 since it touches the same files.*

### Step 10. Add SEO essentials
- [ ] LocalBusiness JSON-LD schema (name, address, phone, hours, service area, ratings)
- [ ] Open Graph + Twitter Card meta tags (so links unfurl nicely on Facebook / iMessage / Slack)
- [ ] Per-post meta tags via 11ty (title, description, OG image)

**Deliverable:** structured data and social previews working.

### Step 11. Performance + accessibility cleanup
- [ ] Add explicit dimensions to `hero-bg.jpg` (fixes CLS)
- [ ] Pin Lucide icons to a specific version (or inline the few that are used)
- [ ] Audit Google Fonts weights and remove unused ones
- [ ] Fix the trust bar's `&check;` "numbers" with real stats
- [ ] Optional: convert window images to WebP for faster loads

**Deliverable:** clean Lighthouse score, no CLS issues.

---

## Phase 6 — Content strategy *(ongoing, post-Phase 4)*

### Step 12. Define blog content plan
- [ ] Pick 5–10 target keywords for local SEO (e.g. "window replacement Marietta", "energy efficient windows Atlanta")
- [ ] Propose post topics + outlines for user approval
- [ ] Write posts on agreed cadence (weekly / bi-weekly / monthly — TBD)

**Deliverable:** ongoing blog publishing pipeline.

---

## Notes & dependencies

- **Steps 1–4 should be done together** as one cohesive migration, ideally in a single working session, to avoid leaving the repo in a half-converted state.
- **Step 6 (DNS cutover)** is the only step that requires coordinating with whoever currently controls the WordPress domain. Everything else is independent.
- **Steps 7–9 (Workiz integration)** need an API token from the user before they can be built and tested.
- **Phase 5 items** can be folded into Phase 1 if desired — they touch the same files. Separated here for clarity.

## Open questions / decisions pending

- Topic for the first sample blog post (Step 4)
- Workiz API token + which entity to create (Lead vs Job) (Step 7/8)
- Blog cadence — weekly, bi-weekly, or monthly? (Step 12)
- Target keywords for local SEO content plan (Step 12)
- When to cut over `a1windows.com` from WordPress to Cloudflare Pages (Step 6)

## Already completed (for context)

- Replaced Tailwind CDN with built CSS via Tailwind CLI (~31KB minified vs ~400KB CDN script)
- Added `tailwind.config.js`, `package.json` scripts, `.gitignore`
- Fixed invalid `font-800` class on hero `<h1>` → `font-extrabold`
- Added gradient text utilities (`text-gradient-brand`, `text-gradient-brand-light`) for the "Windows" wordmark in navbar and footer; bumped logo sizes
- Highlighted "Eliminate cold drafts, hot spots, and outside noise." copy in the comfort value card
- Verified GitHub Pages deployment is working at https://harringf.github.io/a1windows/
