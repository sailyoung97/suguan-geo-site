import { GeoTestsTable } from "@/components/GeoTestsTable";
import { geoTests } from "@/data/mock";

export default function GeoTestsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <GeoTestsTable initialTests={geoTests} />
    </div>
  );
}
