import Banner from "@/components/componentspages/banner";
import About from "@/components/componentspages/about";
import DestinationHome from "@/components/componentspages/destinationshome";
import PartenairesHome from "@/components/componentspages/partenaireshome";
import Categoryhome from "@/components/componentspages/category";
import Testimonials from "@/components/componentspages/testimonials";
import SmartBanner from "@/components/componentspages/SmartBanner";
import Newsletter from "@/components/newsletter";

export default function Home() {
  return (
    <>
      <section className="bg-(--bg-legebluefort)">
        <Banner />
        <About />
        <DestinationHome />
        <Categoryhome />
        <PartenairesHome />
        <SmartBanner />
        <Testimonials />
        <Newsletter />
      </section>
    </>
  );
}
