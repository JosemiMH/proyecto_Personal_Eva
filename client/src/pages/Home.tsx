import { useEffect } from 'react';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";

import CallToAction from "@/components/CallToAction";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Resources from "@/components/Resources";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import EbookPopup from "@/components/EbookPopup";
import SEO from "@/components/SEO";

const Home = () => {
  // Handle smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (anchor) {
        e.preventDefault();

        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const targetElement = document.querySelector(href || '');

        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Handle sticky header
  useEffect(() => {
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
      if (window.scrollY > 50 && navbar) {
        navbar.classList.add('py-2');
        navbar.classList.remove('py-4');
      } else if (navbar) {
        navbar.classList.add('py-4');
        navbar.classList.remove('py-2');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  return (
    <div className="font-poppins text-charcoal bg-white">
      <SEO
        title="Consultoría Wellness & Spa de Lujo"
        description="Transforma tu hotel con estrategias de wellness rentables. Eva Pérez, experta en gestión de spas y hospitalidad de lujo."
      />
      <Header />
      <section id="home">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="services">
        <Services />
      </section>

      <section id="cta">
        <CallToAction />
      </section>
      <section id="portfolio">
        <Portfolio />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="resources">
        <Resources />
      </section>
      <section id="blog">
        <Blog />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <section id="newsletter">
        <Newsletter />
      </section>
      <Footer />
      <ScrollToTop />
      <EbookPopup />
    </div>
  );
};

export default Home;
