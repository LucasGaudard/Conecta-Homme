import { SearchCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

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
        <SubmitButton pendingLabel="Validando...">
          <SearchCheck className="h-4 w-4" />
          Validar
        </SubmitButton>
      </div>
    </form>
  );
}
