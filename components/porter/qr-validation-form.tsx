import { SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type QrValidationFormProps = {
  defaultToken?: string;
};

export function QrValidationForm({ defaultToken = "" }: QrValidationFormProps) {
  return (
    <form className="surface-card p-4">
      <label className="field-label" htmlFor="token">
        Token do QR Code
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Input
          id="token"
          name="token"
          defaultValue={defaultToken}
          placeholder="Cole ou digite o token"
        />
        <Button type="submit">
          <SearchCheck className="h-4 w-4" />
          Validar
        </Button>
      </div>
    </form>
  );
}
