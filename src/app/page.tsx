import {
  Header,
  Hero,
  CountdownSection,
  AgendaSection,
  ArticleSection,
  GallerySection,
  DonationSection,
  Footer,
} from "@/components/public";
import { getGalleries, getLatestGalleryItem } from "@/app/actions/gallery";
import { getEvents, getLatestEvent } from "@/app/actions/events";
import { getDonationSettings } from "@/app/actions/donations";
import { getCountdownSettings } from "@/app/actions/countdown";

export default async function HomePage() {
  const galleryData = await getGalleries();
  const eventsData = await getEvents();
  const latestGallery = await getLatestGalleryItem();
  const latestEvent = await getLatestEvent();
  const donationSettings = await getDonationSettings();
  const countdownSettings = await getCountdownSettings();

  return (
    <>
      <Header />
      <main>
        <Hero
          mosqueName="Al Arqam"
          tagline="Bersama membangun generasi muda yang islami dan bermanfaat bagi masyarakat"
          latestEventTitle={latestEvent?.title}
          latestGalleryImage={latestGallery?.src}
        />

        {/* Dynamic Countdown Section from CMS */}
        {countdownSettings?.is_active && (
          <CountdownSection
            targetDate={countdownSettings.target_date}
            eventName={countdownSettings.title}
            description={countdownSettings.description}
          />
        )}

        <AgendaSection events={eventsData} />
        <ArticleSection />
        <GallerySection initialData={galleryData} />
        <DonationSection donation={donationSettings || undefined} />
      </main>
      <Footer />
    </>
  );
}
