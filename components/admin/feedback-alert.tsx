type FeedbackAlertProps = {
  error?: string;
  success?: string;
};

export function FeedbackAlert({ error, success }: FeedbackAlertProps) {
  if (!error && !success) {
    return null;
  }

  return (
    <div
      className={
        error
          ? "rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm"
          : "rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm"
      }
    >
      {error ?? success}
    </div>
  );
}
