'use client';

import { useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import About from './About';
import Services from './Services';
import Process from './Process';
import Testimonials from './Testimonials';
import ServiceComparison from './ServiceComparison';
import FAQ from './FAQ';
import CTA from './CTA';
import RegularBooking from './RegularBooking';
import Footer from './Footer';

const LoadingPlaceholder = () => (
  <div className="min-h-[300px] flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-brown rounded-full border-t-transparent animate-spin"></div>
  </div>
);

import { CMSProvider } from '../contexts/CMSContext';

const HomePage = ({ cmsData }: { cmsData?: Record<string, string> | null }) => {
  useEffect(() => {
    const anchorElements = Array.from(document.querySelectorAll('a[href^="#"]')) as HTMLAnchorElement[];

    const handleAnchorClick = (event: Event) => {
      event.preventDefault();
      const anchor = event.currentTarget as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: (target as HTMLElement).offsetTop - 80,
          behavior: 'smooth',
        });
      }
    };

    anchorElements.forEach(anchor => anchor.addEventListener('click', handleAnchorClick));

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    };

    const intersectionObserver = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    });

    const animatedElements = Array.from(document.querySelectorAll('.animate-on-scroll'));
    animatedElements.forEach(element => intersectionObserver.observe(element));

    const deferredImages = Array.from(document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]'));

    let imageObserver: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      imageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.classList.add('loaded');
              imageObserver?.unobserve(img);
            }
          }
        });
      });

      deferredImages.forEach(img => imageObserver?.observe(img));
    } else {
      deferredImages.forEach(img => {
        const src = img.dataset.src;
        if (src) {
          img.src = src;
        }
      });
    }

    return () => {
      anchorElements.forEach(anchor => anchor.removeEventListener('click', handleAnchorClick));
      intersectionObserver.disconnect();
      imageObserver?.disconnect();
    };
  }, []);

  return (
    <CMSProvider initialData={cmsData}>
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Header />
        <main>
          <Hero />
          <Features />
          <About />
          <Services />
          <Process />
          <ServiceComparison />
          <Testimonials />
          <CTA />
          <FAQ />
          <RegularBooking />
        </main>
        <Footer />
      </div>
    </CMSProvider>
  );
};

export default HomePage;
