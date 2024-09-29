import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";

// export const metadata = {};

export async function generateStaticParams() {
  const cabins = await getCabins();

  const cabinIds = cabins.map((cabin) => {
    cabinId: String(cabin.id);
  });

  return cabinIds;
}

export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.cabinId);

  return {
    title: `Cabin ${name}`,
  };
}

async function Page({ params }) {
  // Note: Here We have a blocking waterfall, means we are fetching multiple pieces of data that don't depen on eachother but still blocking eachother.
  // Note: One approach to fixing this is "Promise.all"
  const cabin = await getCabin(params.cabinId);
  // const settings = await getSettings();
  // const bookedDates = await getBookedDatesByCabinId(params.cabinId);

  // Note: Now it can be as fastest as the slowest promise, but it's not perfect yet.
  // Note: Better way is to instead of fetching all the data on the parent page we can create differnet bunch of components and then have each component fetch only the data that it needs and then those components can be streamed in as they become ready.
  // const [cabin, settings, bookedDates] = await Promise.all([
  //   getCabin(params.cabinId),
  //   getSettings(),
  //   getBookedDatesByCabinId(params.cabinId),
  // ]);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />
      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner message="Loading Reservation..." />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}

export default Page;
