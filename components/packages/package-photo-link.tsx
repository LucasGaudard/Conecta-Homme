/* eslint-disable @next/next/no-img-element */

type PackagePhotoLinkProps = {
  photoUrl?: string | null;
};

export function PackagePhotoLink({ photoUrl }: PackagePhotoLinkProps) {
  if (!photoUrl) {
    return <span className="text-slate-500">Sem foto</span>;
  }

  return (
    <div className="flex items-center gap-3">
      <a href={photoUrl} rel="noreferrer" target="_blank">
        <img
          alt="Foto da encomenda"
          className="h-14 w-14 rounded-md border border-slate-200 object-cover shadow-sm"
          src={photoUrl}
        />
      </a>
      <a
        className="font-medium text-navy-700 underline-offset-4 hover:underline"
        href={photoUrl}
        rel="noreferrer"
        target="_blank"
      >
        Ver foto
      </a>
    </div>
  );
}
