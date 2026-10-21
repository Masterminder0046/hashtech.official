# Hash_Tech — Vercel + Formspree Edition

This is the portfolio website with your official #TECH logo. It runs with plain HTML, CSS and JavaScript. Vercel hosts the pages; Formspree sends contact enquiries to your configured inbox.

## One thing you must configure: Formspree endpoint

1. Sign in at https://formspree.io/forms and select your Hash_Tech contact form.
2. Copy your form's endpoint. It looks like `https://formspree.io/f/abcdefgh` (the ending is an example, NOT a real ID).
3. Open `index.html`, find `https://formspree.io/f/YOUR_FORM_ID`, and replace it with YOUR exact endpoint.
4. Save the file. Do not paste an API key, password, or private token; only the public submission URL.
5. Commit/push your changes to the GitHub repository connected to Vercel, or redeploy the updated site through Vercel.
6. Open the LIVE site and submit a test enquiry using your own name/email and a test message.
7. Confirm the test appears in the Formspree submissions dashboard and an email arrives at `sheikmohamed0046@gmail.com`. Check Spam/Junk if necessary, and confirm Formspree notification settings/verified receiving email.

The JavaScript now sends POST requests to your Formspree endpoint with the `Accept: application/json` header, displays feedback, and only says 'sent' after a successful response. No server-side code or secret is needed.

## File list

- `index.html`: website and SEO; contains the one endpoint to change
- `style.css`: design and animations
- `script.js`: navigation, theme, cursor and Formspree submission logic
- `assets/`: your logo, favicon, social image and app icon
- `sitemap.xml` and `robots.txt`: replace the example domain before launch
- `thanks.html`: an unused optional standalone thank-you page

## Run locally

From this folder, run `python -m http.server 8000`, then visit `http://localhost:8000` to preview it. With the real Formspree endpoint configured, form submission can work in local HTTP previews as well. Never send repeated automated test requests.

## Deploy to Vercel

1. Create or open the GitHub repository connected to your Vercel project.
2. Upload/commit these website files in the configured root directory; no framework or build command is required.
3. Push to GitHub and wait for the Vercel deployment to show Ready.
4. Visit the production URL and submit one test contact form.
5. When you connect a custom domain, update `YOUR-DOMAIN.example` in `index.html`, `sitemap.xml`, and `robots.txt` with your real domain.

## Common troubleshooting

- 'Contact form setup is incomplete': replace `YOUR_FORM_ID` in `index.html` with your real endpoint.
- 'Could not send': inspect browser Developer Tools Network tab; check HTTP status and Formspree dashboard for validation errors or rate limits.
- Email missing but submission appears in Formspree: check your spam folder, notification settings and verified recipient email.
- Old Netlify form: this edition removes Netlify-specific form submission code; do not put it back.

## Other launch tasks

- Replace domain placeholders, and optionally add a GA4 Measurement ID and verify the site in Google Search Console.
- Only publish genuine client testimonials and workshop statistics once available.
- WhatsApp, Instagram, LinkedIn, GitHub and email contact links are preserved.

Reference: https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax
