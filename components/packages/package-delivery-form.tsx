import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { deliverPackageAction } from "@/lib/packages/actions";

type PackageDeliveryFormProps = {
  packageId: string;
};

export function PackageDeliveryForm({ packageId }: PackageDeliveryFormProps) {
  return (
    <form action={deliverPackageAction} className="flex w-full flex-col gap-2 sm:min-w-72 sm:flex-row">
      <input type="hidden" name="packageId" value={packageId} />
      <Input name="pickedUpByName" placeholder="Quem retirou" required />
      <SubmitButton size="sm" className="h-10" pendingLabel="Entregando...">
        <CheckCircle2 className="h-4 w-4" />
        Entregar
      </SubmitButton>
    </form>
  );
}
