import Gate from '@/components/Gate';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Story from '@/components/Story';
import Soundboard from '@/components/Soundboard';
import Vlogs from '@/components/Vlogs';
import Music from '@/components/Music';
import Gallery from '@/components/Gallery';
import Codes from '@/components/Codes';
import BrandCta from '@/components/BrandCta';
import Reveals from '@/components/Reveals';
import { SPELLINGS } from '@/lib/site';

export default function Home() {
  return (
    <>
      <Gate />
      <Reveals />
      <Hero />
      <Marquee items={[...SPELLINGS, 'New SIUP unlocked']} />
      <Story />
      <Marquee items={['3.7M followers', '70.8M TikTok likes', '1.3K+ videos', 'Two vlogs a week']} variant="ink" reverse />
      <Soundboard />
      <Vlogs />
      <Music />
      <Gallery />
      <Codes />
      <BrandCta />
    </>
  );
}
