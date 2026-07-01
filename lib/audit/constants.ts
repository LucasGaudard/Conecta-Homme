export const auditActions = [
  "CREATE",
  "UPDATE",
  "INACTIVATE",
  "DELIVER",
  "REGISTER",
  "GENERATE",
  "VALIDATE",
] as const;

export const auditModules = [
  "ACCOUNT",
  "ACCESS",
  "CONDOMINIUM",
  "PACKAGE",
  "QRCODE",
  "UNIT",
] as const;

export const auditActionLabels: Record<string, string> = {
  CREATE: "Criacao",
  DELIVER: "Entrega",
  GENERATE: "Geracao",
  INACTIVATE: "Inativacao",
  REGISTER: "Registro",
  UPDATE: "Atualizacao",
  VALIDATE: "Validacao",
};

export const auditModuleLabels: Record<string, string> = {
  ACCOUNT: "Conta",
  ACCESS: "Acesso",
  CONDOMINIUM: "Condominio",
  PACKAGE: "Encomenda",
  QRCODE: "QR Code",
  UNIT: "Unidade",
};
