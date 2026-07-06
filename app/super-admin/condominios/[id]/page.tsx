import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { CondominiumDetail } from "@/components/super-admin/condominium-detail";
import { getCondominiumById } from "@/lib/super-admin/queries";

type CondominiumDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function CondominiumDetailPage({
  params,
  searchParams,
}: CondominiumDetailPageProps) {
  const [{ id }, feedback] = await Promise.all([params, searchParams]);
  const data = await getCondominiumById(id);

  return (
    <div className="space-y-6">
      <FeedbackAlert error={feedback.error} success={feedback.success} />
      <CondominiumDetail {...data} />
    </div>
  );
}
