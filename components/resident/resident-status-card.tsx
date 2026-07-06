import { Car, Home, Ban } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateResidentPresenceAction } from "@/lib/resident/actions";
import type { PresenceStatus } from "@prisma/client";

type ResidentStatusCardProps = {
  error?: string;
  presenceStatus: PresenceStatus;
  success?: string;
};

const options = [
  {
    description: "Estou em casa",
    icon: Home,
    label: "Estou em casa",
    value: "HOME",
  },
  {
    description: "Não estou em casa",
    icon: Car,
    label: "Não estou em casa",
    value: "AWAY",
  },
  {
    description: "Não quero receber visitas",
    icon: Ban,
    label: "Não quero receber visitas",
    value: "DO_NOT_DISTURB",
  },
] satisfies Array<{
  description: string;
  icon: typeof Home;
  label: string;
  value: PresenceStatus;
}>;

export function ResidentStatusCard({
  error,
  presenceStatus,
  success,
}: ResidentStatusCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base text-navy-950">Status da residência</CardTitle>
        <StatusBadge status={presenceStatus} type="presence" />
      </CardHeader>
      <CardContent className="space-y-4">
        <FeedbackAlert error={error} success={success} />
        <div className="grid min-w-0 gap-3 xl:grid-cols-2 2xl:grid-cols-3">
          {options.map((option) => (
            <form key={option.value} action={updateResidentPresenceAction}>
              <input type="hidden" name="presenceStatus" value={option.value} />
              <SubmitButton
                variant={presenceStatus === option.value ? "default" : "outline"}
                className="h-auto min-w-0 w-full justify-start whitespace-normal px-4 py-3"
                pendingLabel="Atualizando..."
              >
                <option.icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 text-left leading-5">{option.label}</span>
              </SubmitButton>
            </form>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
