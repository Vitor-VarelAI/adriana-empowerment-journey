import React, { createContext, useState, useContext, ReactNode } from 'react';

type ServicePackage = {
  name: string;
  price: string;
  id?: number;
};

interface BookingContextType {
  selectedPackage: ServicePackage | null;
  setSelectedPackage: (pkg: ServicePackage | null) => void;
  clearSelectedPackage: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);

  const clearSelectedPackage = () => {
    setSelectedPackage(null);
  };

  return (
    <BookingContext.Provider value={{ selectedPackage, setSelectedPackage, clearSelectedPackage }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
