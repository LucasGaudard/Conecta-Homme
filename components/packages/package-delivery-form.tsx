import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deliverPackageAction } from "@/lib/packages/actions";

type PackageDeliveryFormProps = {
  packageId: string;
};

export function PackageDeliveryForm({ packageId }: PackageDeliveryFormProps) {
  return (
    <form action={deliverPackageAction} className="flex min-w-72 gap-2">
      <input type="hidden" name="packageId" value={packageId} />
      <Input name="pickedUpByName" placeholder="Quem retirou" required />
      <Button type="submit" size="sm">
        <CheckCircle2 className="h-4 w-4" />
        Entregar
      </Button>
    </form>
  );
}
