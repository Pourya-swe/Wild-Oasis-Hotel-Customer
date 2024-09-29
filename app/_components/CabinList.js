// import { unstable_noStore as noStore } from "next/cache";
import { getCabins } from "../_lib/data-service";
import CabinCard from "./CabinCard";

async function CabinList({ filter }) {
  // noStore();
  const cabins = await getCabins();

  //// Gaurd Clause
  if (!cabins.length) return null;

  ////// Filter
  let displayedCapacity;
  switch (filter) {
    case "small":
      displayedCapacity = cabins.filter((cabin) => cabin.maxCapacity <= 3);
      break;
    case "medium":
      displayedCapacity = cabins.filter(
        (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
      );
      break;
    case "large":
      displayedCapacity = cabins.filter((cabin) => cabin.maxCapacity >= 8);
      break;
    default:
      displayedCapacity = cabins;
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCapacity.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
