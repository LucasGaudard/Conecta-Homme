"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type SubmitButtonProps = ButtonProps & {
  pendingLabel?: string;
};

export function SubmitButton({
  children,
  disabled,
  pendingLabel = "Processando...",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending} {...props}>
      {pending ? (
        <>
          <LoadingSpinner />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
