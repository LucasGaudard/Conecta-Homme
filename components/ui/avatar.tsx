import { cn } from "@/lib/utils";

type AvatarInitialProps = {
  className?: string;
  name?: string | null;
};

function getInitial(name?: string | null) {
  const trimmed = name?.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "U";
}

export function AvatarInitial({ className, name }: AvatarInitialProps) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-semibold text-white shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      {getInitial(name)}
    </span>
  );
}
