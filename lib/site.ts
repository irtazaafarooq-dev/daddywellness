export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://daddywellness-three.vercel.app').replace(/\/$/, '');

export const PERSON = {
  name: 'Richie Lovelace',
  brand: 'Daddy Wellness',
  handle: '@daddywellness',
  email: 'daddywellnessmgmt@gmail.com',
};

export const SOCIALS = {
  instagram: 'https://www.instagram.com/daddywellness',
  tiktok: 'https://www.tiktok.com/@daddywelness',
  youtube: 'https://www.youtube.com/@daddywellness',
  snapchat: 'https://www.snapchat.com/add/richeelovelace',
  spotify: 'https://open.spotify.com/user/1254420419',
  linkme: 'https://link.me/daddywellness',
};

export const STATS = [
  { label: 'Instagram', value: 2, suffix: 'M', decimals: 0, href: SOCIALS.instagram },
  { label: 'TikTok', value: 1.4, suffix: 'M', decimals: 1, href: SOCIALS.tiktok },
  { label: 'TikTok likes', value: 70.8, suffix: 'M', decimals: 1, href: SOCIALS.tiktok },
  { label: 'YouTube', value: 160, suffix: 'K', decimals: 0, href: SOCIALS.youtube },
];

export const VLOGS = [
  { id: 'N4wTXW4Fjtk', title: 'I Let Strangers Control My Life for 24 Hours in Spain', img: '/img/yt-spain.jpg', tag: 'Spain' },
  { id: 'xKg_dEirVb8', title: 'We Got WASTED At Greek Wedding...', img: '/img/yt-greek-wedding.jpg', tag: 'Greece' },
  { id: 'maILtLxm0eA', title: 'We Escaped to the Greek Volcanic Beaches', img: '/img/yt-volcanic-beaches.jpg', tag: 'Greece' },
  { id: 'DzSJVhelRak', title: 'Our First Night at the NEW Miami House', img: '/img/yt-miami-house.jpg', tag: 'Miami' },
];

export const GALLERY = [
  { src: '/img/yacht-sunset.jpg', alt: 'Richie Lovelace in a SIUUP t-shirt on a boat at sunset', label: 'Golden hour SIUP', w: 487, h: 640 },
  { src: '/img/oktoberfest.jpg', alt: 'Richie Lovelace at Oktoberfest holding a beer', label: 'Oktoberfest', w: 480, h: 640 },
  { src: '/img/temple.jpg', alt: 'Richie Lovelace at a temple with golden Buddha statues', label: 'Temple run', w: 480, h: 640 },
  { src: '/img/golf-cart.jpg', alt: 'Richie Lovelace in a SIUUP cap doing his hand sign with a fan', label: 'Fan encounter', w: 480, h: 640 },
  { src: '/img/sweden.jpg', alt: 'Richie Lovelace in a car doing his hand sign, captioned Thank you Sweden', label: 'Thank you Sweden', w: 480, h: 640 },
  { src: '/img/club.jpg', alt: 'Richie Lovelace in a nightclub doing his hand sign', label: 'After dark', w: 586, h: 640 },
  { src: '/img/suit-shop.jpg', alt: 'Richie Lovelace trying on a grey suit in a tailor shop', label: '1096 days later', w: 572, h: 640 },
  { src: '/img/night-out.jpg', alt: 'Richie Lovelace pointing at the camera on a night out', label: 'Night shift', w: 640, h: 640 },
];

export const CODES = [
  { brand: 'Polymarket', code: 'DADDY', href: 'https://polymarket-app.onelink.me/S8ac/DADDY', note: 'Sign up through my link' },
  { brand: 'Cellvita Research Labs', code: 'DADDY', href: 'https://cellvitaresearchlabs.com/?coupon=daddy', note: 'Code applies at checkout' },
];

export const SPELLINGS = ['SIUP', 'SIUUP', 'SIIUUPPP', 'SEEEEEUP', 'SIUUUUUP', 'SUIIIP', 'SIIIIIUP'];
