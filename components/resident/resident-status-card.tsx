import { Car, Home, Ban } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    description: "Nao estou em casa",
    icon: Car,
    label: "Nao estou em casa",
    value: "AWAY",
  },
  {
    description: "Nao quero receber visitas",
    icon: Ban,
    label: "Nao quero receber visitas",
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
        <CardTitle className="text-base text-navy-950">Status da residencia</CardTitle>
        <StatusBadge status={presenceStatus} type="presence" />
      </CardHeader>
      <CardContent className="space-y-4">
        <FeedbackAlert error={error} success={success} />
        <div className="grid gap-3 md:grid-cols-3">
          {options.map((option) => (
            <form key={option.value} action={updateResidentPresenceAction}>
              <input type="hidden" name="presenceStatus" value={option.value} />
              <Button
                type="submit"
                variant={presenceStatus === option.value ? "default" : "outline"}
                className="h-auto w-full justify-start px-4 py-3"
              >
                <option.icon className="h-4 w-4" />
                <span className="text-left">{option.label}</span>
              </Button>
            </form>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
