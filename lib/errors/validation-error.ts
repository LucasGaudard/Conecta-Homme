import { ZodError } from "zod";

export function getValidationErrorMessage(error: ZodError) {
  return error.issues[0]?.message ?? "Dados invalidos.";
}
