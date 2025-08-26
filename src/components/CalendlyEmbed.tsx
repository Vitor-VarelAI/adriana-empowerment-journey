import React, { useEffect } from 'react';

const CalendlyEmbed: React.FC = () => {
  useEffect(() => {
    // Create the script element for Calendly
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    // Cleanup function to remove the script when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    // Here we would typically send this information to your backend or directly to your ESP
    // For now, we'll just log it to the console
    console.log('Newsletter consent:', isChecked);
    
    // In a real implementation, you would:
    // 1. Capture the user's email from the Calendly widget after booking
    // 2. Send the email and consent status to your ESP (MailerLite/Brevo) with double opt-in
    // 3. Add the appropriate tag ("workshops") to the contact
  };

  return (
    <section id="book" className="section-padding bg-offwhite">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Agende a Sua Sessão</h2>
          <p className="text-muted-foreground mt-4">
            Selecione o serviço, a data e o horário que melhor se adequam à sua agenda.
          </p>
        </div>
        
        {/* Calendly inline widget */}
        <div className="calendly-inline-widget"
             data-url="https://calendly.com/adrianairia/session?hide_gdpr_banner=1"
             style={{ minWidth: '320px', height: '800px' }}>
        </div>
        
        {/* Newsletter Consent Checkbox */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="newsletter-consent"
              className="mt-1 h-5 w-5 text-brown focus:ring-brown border-gray-300 rounded"
              onChange={handleConsentChange}
            />
            <label htmlFor="newsletter-consent" className="text-sm text-gray-700">
              Aceito receber emails com novidades e workshops.
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendlyEmbed;