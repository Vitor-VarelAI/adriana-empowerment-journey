import { useEffect, lazy, Suspense } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import Services from '../components/Services';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import ServiceComparison from '../components/ServiceComparison';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const LoadingPlaceholder = () => (
  <div className="min-h-[300px] flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-brown rounded-full border-t-transparent animate-spin"></div>
  </div>
);

const Index = () => {
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href') as string);
        if (target) {
          window.scrollTo({
            top: (target as HTMLElement).offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, { 
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });
    
    const deferredImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.classList.add('loaded');
              imageObserver.unobserve(img);
            }
          }
        });
      });
      
      deferredImages.forEach(img => imageObserver.observe(img));
    } else {
      deferredImages.forEach(img => {
        const imgEl = img as HTMLImageElement;
        if (imgEl.dataset.src) {
          imgEl.src = imgEl.dataset.src;
        }
      });
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
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
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
