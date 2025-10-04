"use client";

import { useEffect } from 'react';
import MentoriaHeader from '@/components/mentoria/MentoriaHeader';
import MentoriaHero from '@/components/mentoria/MentoriaHero';
import AuthorityProof from '@/components/mentoria/AuthorityProof';
import SimpleBenefits from '@/components/mentoria/SimpleBenefits';
import MentorAbout from '@/components/mentoria/MentorAbout';
import QualificationQuiz from '@/components/mentoria/QualificationQuiz';
import Testimonials from '@/components/mentoria/Testimonials';
import FinalUrgency from '@/components/mentoria/FinalUrgency';
import MentoriaFooter from '@/components/mentoria/MentoriaFooter';

const MentoriaOutubro2025Page = () => {
  useEffect(() => {
    document.title = 'Mentoria Exclusiva Outubro 2025 | Adriana Empowerment Journey';

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
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-white">
      <MentoriaHeader />
      <main>
        <MentoriaHero />
        <AuthorityProof />
        <SimpleBenefits />
        <MentorAbout />
        <QualificationQuiz />
        <Testimonials />
        <FinalUrgency />
      </main>
      <MentoriaFooter />
    </div>
  );
};

export default MentoriaOutubro2025Page;
