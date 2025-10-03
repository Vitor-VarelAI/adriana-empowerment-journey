"use client";

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MentoriaHero from '@/components/mentoria/MentoriaHero';
import MentoriaBenefits from '@/components/mentoria/MentoriaBenefits';
import MentoriaCTA from '@/components/mentoria/MentoriaCTA';
import MentoriaForm from '@/components/mentoria/MentoriaForm';
import SectionWrapper from '@/components/SectionWrapper';

const MentoriaPage = () => {
  useEffect(() => {
    document.title = 'Mentoria de 6 Meses | Adriana Empowerment Journey';

    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchorNode => {
      const anchorElement = anchorNode as HTMLAnchorElement;
      anchorElement.addEventListener('click', function(this: HTMLAnchorElement, e: MouseEvent) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href) return;
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: (target as HTMLElement).offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });

    // Intersection Observer for animations
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

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main>
        <MentoriaHero />
        <MentoriaBenefits />
        <MentoriaCTA />

        {/* Application Form Section */}
        <SectionWrapper id="application-form" background="light" className="py-16 md:py-24">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="section-subtitle text-brown">CANDIDATURA</span>
              <h2 className="section-title mb-6">Garanta Sua Vaga na Mentoria</h2>
              <p className="text-lg text-muted-foreground">
                Preencha o formulário abaixo para iniciar sua jornada de transformação.
                Avaliamos cada candidatura com atenção para garantir o máximo aproveitamento.
              </p>
            </div>
            <MentoriaForm />
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default MentoriaPage;