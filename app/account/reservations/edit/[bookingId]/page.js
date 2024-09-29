import EditReservationForm from "@/app/_components/EditReservationForm";
import { getBooking, getCabin } from "@/app/_lib/data-service";

async function Page({ params }) {
  const { bookingId } = params;
  const { numGuests, observations, cabinId } = await getBooking(bookingId);
  const { maxCapacity } = await getCabin(cabinId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>
      <EditReservationForm
        bookingId={bookingId}
        numGuests={numGuests}
        maxCapacity={maxCapacity}
        observations={observations}
      />
    </div>
  );
}

export default Page;
