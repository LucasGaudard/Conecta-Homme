import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SectionCardProps = {
  children: ReactNode;
  icon?: ReactNode;
  title: string;
};

export function SectionCard({ children, icon, title }: SectionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base text-navy-950">{title}</CardTitle>
        {icon ? <span className="text-navy-700">{icon}</span> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
