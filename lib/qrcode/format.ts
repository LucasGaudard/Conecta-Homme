export function formatQrDateTime(date?: Date | null) {
  if (!date) {
    return "Permanente";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatQrWhatsAppDateTime(date?: Date | null) {
  if (!date) {
    return "Permanente";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replace(",", " as");
}

export function toDateTimeLocalValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);

  return local.toISOString().slice(0, 16);
}

export function defaultVisitorQrExpiresAt(authorizationEndsAt: Date) {
  const defaultDate = new Date();
  defaultDate.setHours(defaultDate.getHours() + 12);

  return defaultDate > authorizationEndsAt ? authorizationEndsAt : defaultDate;
}
