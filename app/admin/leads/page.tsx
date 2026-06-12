import { LeadsCrm } from "@/components/LeadsCrm";
import { leads } from "@/data/mock";

export default function LeadsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <LeadsCrm initialLeads={leads} />
    </div>
  );
}
