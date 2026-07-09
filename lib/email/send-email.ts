type SendEmailInput = {
  html: string;
  subject: string;
  text: string;
  to: string;
};

type SendEmailResult = {
  ok: boolean;
  reason?: string;
};

function getEmailFrom() {
  return process.env.EMAIL_FROM;
}

function getResendApiKey() {
  return process.env.RESEND_API_KEY;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const resendApiKey = getResendApiKey();
  const from = getEmailFrom();

  if (!resendApiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[dev-email]", {
        subject: input.subject,
        text: input.text,
        to: input.to,
      });
    } else {
      console.error("Password reset email is not configured. Set RESEND_API_KEY and EMAIL_FROM.");
    }

    return {
      ok: process.env.NODE_ENV !== "production",
      reason: "email_not_configured",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from,
      html: input.html,
      subject: input.subject,
      text: input.text,
      to: input.to,
    }),
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    console.error("Failed to send password reset email.", {
      status: response.status,
    });

    return {
      ok: false,
      reason: "email_send_failed",
    };
  }

  return { ok: true };
}
