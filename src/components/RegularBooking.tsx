import SectionWrapper from './SectionWrapper';
import BookingRequestForm from './BookingRequestForm';

const RegularBooking = () => {
  return (
    <SectionWrapper background="custom" className="section-padding">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-4 md:space-y-6">
            <h2 className="text-3xl font-semibold text-[#111111] md:text-4xl">
              Agende a Sua Sessão Regular
            </h2>
            <p className="text-base text-[#555555] md:text-lg">
              Escolhe o tipo de sessão, a data e o horário preferido. Confirmamos tudo por email em até 24h úteis para
              garantir que recebeste atenção personalizada.
            </p>
          </div>

          <BookingRequestForm />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default RegularBooking;
