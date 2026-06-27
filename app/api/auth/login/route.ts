import { NextResponse } from "next/server";
import { UserStatus } from "@prisma/client";
import { roleHomePath, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/constants";
import { createSessionToken } from "@/lib/auth/session";
import { loginSchema } from "@/lib/auth/validation";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Preencha os dados de acesso corretamente." },
      { status: 400 },
    );
  }

  const { identifier, password } = parsed.data;
  const normalizedIdentifier = identifier.toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier },
      ],
    },
  });

  if (!user || user.status !== UserStatus.ACTIVE) {
    return NextResponse.json(
      { message: "Credenciais invalidas." },
      { status: 401 },
    );
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);

  if (!passwordMatches) {
    return NextResponse.json(
      { message: "Credenciais invalidas." },
      { status: 401 },
    );
  }

  const token = await createSessionToken({
    name: user.name,
    role: user.role,
    userId: user.id,
  });
  const response = NextResponse.json({ redirectTo: roleHomePath[user.role] });

  response.cookies.set({
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    name: SESSION_COOKIE_NAME,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    value: token,
  });

  return response;
}
