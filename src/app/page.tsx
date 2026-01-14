import {
  Header,
  Hero,
  AgendaSection,
  ArticleSection,
  GallerySection,
  DonationSection,
  Footer,
} from "@/components/public";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          mosqueName="Al Arqam"
          tagline="Bersama membangun generasi muda yang islami dan bermanfaat bagi masyarakat"
        />
        <AgendaSection />
        <ArticleSection />
        <GallerySection />
        <DonationSection />
      </main>
      <Footer />
    </>
  );
}
