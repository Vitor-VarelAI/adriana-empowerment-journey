import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  background?: 'white' | 'offwhite' | 'custom';
}

const SectionWrapper = ({
  children,
  id,
  className = '',
  background = 'white'
}: SectionWrapperProps) => {
  const bgClasses = {
    white: 'bg-white',
    offwhite: 'bg-offwhite',
    custom: ''
  };

  return (
    <section
      id={id}
      className={`section-padding ${bgClasses[background]} ${className}`}
    >
      {children}
    </section>
  );
};

export default SectionWrapper;