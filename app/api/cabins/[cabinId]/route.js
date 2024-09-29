// Note: Now from this file we can export one or more functions where each of them can correspond to one the Http verbs.

import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

// Note: In order to send back response or to check out the request itself, these route handlers use web standards such as "Request" and "Response".
// Note: We can't give these functions custome names.
export async function GET(request, { params }) {
  const { cabinId } = params;

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);
    return Response.json({ cabin, bookedDates });
  } catch {
    return Response.json({ message: "Cabin not found!" });
  }
}
// export async function POST() {}
