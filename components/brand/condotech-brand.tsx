import Image from "next/image";

type CondotechBrandProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
};

const imageSizes = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-24 w-24",
};

export function CondotechBrand({
  className = "",
  imageClassName = "",
  priority = false,
  showText = true,
  size = "md",
}: CondotechBrandProps) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/condotech-logo.jpeg"
        alt="CONDOTECH"
        width={256}
        height={256}
        priority={priority}
        className={`${imageSizes[size]} shrink-0 rounded-md object-contain ${imageClassName}`}
      />
      {showText ? (
        <span className="min-w-0">
          <span className="block truncate font-semibold tracking-normal">
            CONDOTECH
          </span>
          <span className="block truncate text-xs font-medium opacity-80">
            Gestão inteligente
          </span>
        </span>
      ) : null}
    </span>
  );
}
