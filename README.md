# Daddy Wellness website

Portfolio site for Richie Lovelace (@daddywellness). Next.js 15 (App Router), GSAP, Lenis.

## Run locally

    npm install
    npm run dev        # http://localhost:5518

## The SIUP sound

`public/audio/siup.mp3` is the SIUP from "Suggie Boogie" (Rossi feat. Daddy Wellness),
0:13.5-0:14.7, where the beat drops out and only the vocal is left. Every soundboard
flavour (classic, looong, underwater, legendary, chipmunk) is built from that file in
`lib/siup-audio.ts`; "Looong" loops the held "IUUU" (HOLD_FROM/HOLD_TO). Replace the file
to change the sound everywhere. If it fails to load, a synthesized SIUP is used instead.

## Site URL

SEO tags, the sitemap and robots.txt read `NEXT_PUBLIC_SITE_URL`
(defaults to https://daddywellness.vercel.app). Set it in Vercel when the domain changes.

## Contact form ("Connect with Richie" + brand enquiry form)

Submissions go to `app/api/contact/route.ts`, which emails them to the management inbox
through [Resend](https://resend.com) with Reply-To set to the visitor, so management just hits reply.

Setup (once):
1. Create a Resend account. Until a domain is verified, Resend only delivers to the account's
   own email, so sign up with daddywellnessmgmt@gmail.com, or verify the site's domain and set CONTACT_FROM.
2. Create an API key and add it in Vercel → Project → Settings → Environment Variables as `RESEND_API_KEY`.
3. Redeploy.

Without the key the forms still render and tell visitors to email management directly.
Spam protection: hidden honeypot field + max 5 messages per IP per 10 minutes.
