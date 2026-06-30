import { Activity, BarChart3, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyDashboardProps = {
  description: string;
  title: string;
};

const summaryCards = [
  { title: "Acessos", icon: Activity },
  { title: "Moradores", icon: Users },
  { title: "Pendencias", icon: Clock },
  { title: "Relatorios", icon: BarChart3 },
];

export function EmptyDashboard({ description, title }: EmptyDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <Card key={item.title} className="surface-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-500">
                {item.title}
              </CardTitle>
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-navy-100 bg-navy-50 text-navy-900">
                <item.icon className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-navy-950">--</div>
              <p className="mt-1 text-xs text-slate-500">
                Dados serao conectados em etapas futuras.
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-medium text-navy-950">
          Dashboard vazio nesta etapa
        </p>
        <p className="mt-2 text-sm text-slate-500">
          A estrutura visual esta pronta para receber modulos sem antecipar
          funcionalidades.
        </p>
      </section>
    </div>
  );
}
