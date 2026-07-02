import { ToastMessage } from "@/components/ui/toast-message";

type FeedbackAlertProps = {
  error?: string;
  success?: string;
};

export function FeedbackAlert({ error, success }: FeedbackAlertProps) {
  if (!error && !success) {
    return null;
  }

  const isError = Boolean(error);

  return (
    <ToastMessage
      type={isError ? "error" : "success"}
      title={isError ? "Nao foi possivel concluir" : "Tudo certo"}
      description={error ?? success}
    />
  );
}
