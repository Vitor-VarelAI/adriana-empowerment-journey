import SectionWrapper from './SectionWrapper';
import BookingTable from './BookingTable';

const RegularBooking = () => {
  return (
    <SectionWrapper background="custom" className="section-padding">
      <div className="container mx-auto">
        <BookingTable />
      </div>
    </SectionWrapper>
  );
};

export default RegularBooking;
