import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SoundProvider } from '@/components/SoundProvider';
import SmoothScroll from '@/components/SmoothScroll';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { PERSON, SITE_URL, SOCIALS } from '@/lib/site';

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const DESC = 'Richie Lovelace (@daddywellness): comedy, travel vlogs and the SIUP. 3.7M followers across Instagram, TikTok and YouTube. Brand deals: daddywellnessmgmt@gmail.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Daddy Wellness: Richie Lovelace | SIUP', template: '%s | Daddy Wellness' },
  description: DESC,
  applicationName: 'Daddy Wellness',
  authors: [{ name: PERSON.name, url: SOCIALS.instagram }],
  creator: PERSON.name,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
  openGraph: {
    type: 'website', siteName: 'Daddy Wellness', locale: 'en_US', url: '/',
    title: 'Daddy Wellness: Richie Lovelace | SIUP', description: DESC,
  },
  twitter: { card: 'summary_large_image', title: 'Daddy Wellness: Richie Lovelace | SIUP', description: DESC },
};

export const viewport: Viewport = { themeColor: '#f3eee5', width: 'device-width', initialScale: 1 };

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'Person', '@id': `${SITE_URL}/#richie`,
    name: PERSON.name, alternateName: ['Daddy Wellness', 'daddywellness'],
    url: `${SITE_URL}/`, image: `${SITE_URL}/img/yacht-sunset.jpg`, email: `mailto:${PERSON.email}`,
    jobTitle: 'Content creator', description: DESC,
    knowsAbout: ['Comedy', 'Travel vlogging', 'Short-form video'],
    sameAs: [SOCIALS.instagram, SOCIALS.tiktok, SOCIALS.youtube, SOCIALS.snapchat, SOCIALS.spotify, SOCIALS.linkme],
  },
  { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Daddy Wellness', publisher: { '@id': `${SITE_URL}/#richie` }, inLanguage: 'en' },
];

// Runs before paint: enables reveal styles, and skips the sound gate for the rest of the session once passed.
const boot = `document.documentElement.classList.add('js');try{if(sessionStorage.getItem('dw-gate'))document.documentElement.dataset.gate='done'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <noscript><style>{`[data-reveal]{opacity:1!important;transform:none!important}.gate{display:none!important}`}</style></noscript>
      </head>
      <body>
        <SoundProvider>
          <SmoothScroll />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SoundProvider>
      </body>
    </html>
  );
}
