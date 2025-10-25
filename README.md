# Suhas – Developer Portfolio

A responsive, fast, and minimal portfolio to showcase projects, certificates, skills, and a contact form with EmailJS.

## Features
- **Responsive UI** with Tailwind (CDN) and clean components.
- **Hero** with 1:1 photo placeholder.
- **About** with gradient band, left accent border, and a rotating tagline.
- **Skills** with hover lift animation.
- **Projects** and **Certificates** with thumbnails.
- **Contact links** and **Get in touch** form.
- **EmailJS integration** for direct form-to-email sending with graceful fallback.
- **Dark mode** toggle with `localStorage`.
- **Background**: Vite-like ambient background (radial grid fade, conic gradient blobs, soft noise) with reduced‑motion support.

## Tech Stack
- HTML, CSS (Tailwind via CDN), vanilla JavaScript
- EmailJS (client-side)

## Repository Structure
```
portfilo/
├─ index.html
├─ styles.css
├─ script.js
├─ thumbnail 1.png
├─ thumbnail 2.png
└─ thumbnail 3.png
```

## Getting Started

### 1) Clone and open
- Open the folder in your editor.

### 2) Run locally (recommended)
Serving over http prevents some browser SDK quirks and caching issues.

- PowerShell (Windows):
```powershell
python -m http.server 5500
```
- Then open:
```
http://localhost:5500
```

Alternatively, use VS Code Live Server or any static server.

## Configuration

### Tailwind
- TailwindCDN config is in `index.html` under the inline `<script>` that sets the `primary` color scale and `darkMode: 'class'`.

### Resume/Links/Thumbnails
- Update resume and certificate links in `index.html`.
- Thumbnails currently referenced from the project root:
  - `./thumbnail 1.png`, `./thumbnail 2.png`, `./thumbnail 3.png`

### EmailJS (Contact Form)
The form in `#get-in-touch` is wired via `script.js` to EmailJS. It sends the following template variables:
- `from_name`, `from_email`, `subject`, `message`, `time`, `to_email`

Steps:
1. Create an account at EmailJS.
2. Create an Email **Service** (Gmail or SMTP) and note the Service ID.
3. Create an Email **Template** and add variables used above. Note the Template ID.
4. Get your **Public Key** from API Keys.
5. In `script.js`, set:
```js
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
```
6. Ensure your template body references:
```
{{from_name}}
{{from_email}}
{{subject}}
{{time}}
{{message}}
```

The script dynamically loads the EmailJS SDK and sends the form.
- On success: shows a toast/alert and resets the form.
- On failure: shows an error message (no auto mail client pop-up).

#### Common EmailJS issues
- Gmail API scopes: If you see `Gmail_API: Request had insufficient authentication scopes`, reconnect the Gmail account in EmailJS (Email Services → your service → Reconnect) and accept all permissions. Or use SMTP with an App Password.
- Running from `file://`: Use a local server (see above).
- Template variables mismatch: Ensure variable names in EmailJS match `script.js`.

## Deployment

### GitHub Pages
- Push the repo to GitHub.
- Settings → Pages → Build from `main` branch (root).
- Wait for publish, then visit the provided URL.

### Netlify (recommended)
- New site from Git → pick the repo → deploy.
- No build step needed (static site).

### Vercel
- Import the repo in Vercel → deploy as static.

## Customization
- **Colors/Theme**: Tweak Tailwind config in `index.html`.
- **About**: Edit the content under `#about` and the rotating tagline phrases in `script.js`.
- **Skills**: Add/remove badges in the Skills grid.
- **Projects/Certificates**: Add new cards and update links/thumbnails.
- **Contact**: You can change the “Email” button to link to the form (`#get-in-touch`) instead of `mailto:` if desired.

### Background Effects
The ambient background is composed of three fixed layers inserted at the top of `<body>` in `index.html`:

```html
<div class="bg-grid" aria-hidden="true"></div>
<div class="bg-conic" aria-hidden="true"></div>
<div class="bg-noise" aria-hidden="true"></div>
```

The styles live in `styles.css`:
- `.bg-grid`: subtle radial grid masked to fade toward edges
- `.bg-conic`: two large conic‑gradient blobs rotating slowly
- `.bg-noise`: very light noise overlay for texture

Tuning tips:
- Reduce motion: already honored via `@media (prefers-reduced-motion: reduce)` (stops rotation).
- Softer look: lower `.bg-conic` opacity (e.g., 0.12–0.15) or increase blur.
- More subtle: comment out `.bg-grid` or `.bg-noise` layers.
- Dark mode: adjust colors/opacities with `@media (prefers-color-scheme: dark)` if desired.

## Accessibility & SEO
- Semantic headings and accessible color contrast.
- Motion preferences are respected (reduced‑motion disables background rotation).
- Add your own Open Graph meta tags for richer link previews.

## Troubleshooting
- **Outlook opens instead of sending:** That’s the `mailto:` button in the Contact section. Use the “Get in touch” form to send via EmailJS.
- **Form shows sending failed:** Check EmailJS service connection (Gmail scopes), template variables, or use SMTP.
- **Images not showing:** Confirm filenames and paths (spaces matter), and that they sit alongside `index.html`.

## License
MIT or your preferred license.

---
If you want, I can also add a CI-based deploy (Netlify/Vercel) and a proper favicon/Open Graph image for better link previews.
