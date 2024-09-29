import Spinner from "@/app/_components/Spinner";

function Loading() {
  return (
    <div className="grid item-center justify-center">
      <Spinner />
      <p className="text-lx text-primary-200">Loading Cabin Data...</p>
    </div>
  );
}

export default Loading;
