'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const MentoriaHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = () => {
    const target = document.getElementById('inscricao');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-transparent transition-all duration-200 ${
        isScrolled ? 'bg-white/95 shadow-sm backdrop-blur' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-xl font-playfair text-[#875c51] transition-colors hover:text-[#6B1FBF] md:text-2xl"
        >
          Adriana Coaching
        </Link>
        <button
          type="button"
          onClick={handleCTAClick}
          className="rounded-full bg-[#6B1FBF] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-[#5814A0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6B1FBF]"
        >
          Quero garantir a minha vaga
        </button>
      </div>
    </header>
  );
};

export default MentoriaHeader;
