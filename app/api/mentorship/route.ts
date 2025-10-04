import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const MentorshipApplicationSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(180),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos").max(20).optional(),
  currentProfession: z.string().min(1).max(200).optional(),
  currentChallenge: z.string().min(1).max(1000).optional(),
  mentorshipGoal: z.string().min(1).max(1000).optional(),
  timeCommitment: z.string().max(50).optional(),
  supportLevel: z.string().max(50).optional(),
  availability: z.string().min(1).max(200).optional(),
  expectations: z.string().min(1).max(1000).optional(),
  howHeard: z.string().max(200).optional(),
  consent: z.boolean().refine(val => val === true, "Consentimento obrigatório"),
  newsletter: z.boolean().optional()
});

function createErrorResponse(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
    },
    { status },
  );
}

async function sendNotificationEmail(application: z.infer<typeof MentorshipApplicationSchema>) {
  const { NEXT_PUBLIC_FORMSPREE_ID } = process.env;

  if (!NEXT_PUBLIC_FORMSPREE_ID) {
    console.warn("FORMSPREE_ID não configurado - pulando notificação por email");
    return false;
  }

  try {
    const clean = (value?: string | null) => (value && value.trim().length > 0 ? value.trim() : "Não informado");

    const emailContent = `
NOVA CANDIDATURA - MENTORIA OUTUBRO 2025

📋 DADOS PESSOAIS
Nome: ${clean(application.name)}
Email: ${clean(application.email)}
Telefone: ${clean(application.phone)}

💼 PROFISSÃO E DESAFIOS
Profissão atual: ${clean(application.currentProfession)}
Desafio atual: ${clean(application.currentChallenge)}

🎯 OBJETIVOS E EXPECTATIVAS
Objetivo na mentoria: ${clean(application.mentorshipGoal)}
Expectativas: ${clean(application.expectations)}
Nível de suporte desejado: ${clean(application.supportLevel)}
Compromisso de tempo: ${clean(application.timeCommitment)}
Disponibilidade: ${clean(application.availability)}

📢 COMO CONHECEU
${clean(application.howHeard)}

🔔 NEWSLETTER
${application.newsletter ? "Sim" : "Não"}

Enviado em: ${new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })}
    `.trim();

    const response = await fetch(`https://formspree.io/f/${NEXT_PUBLIC_FORMSPREE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        subject: `Nova Candidatura - ${application.name}`,
        email: application.email,
        name: application.name,
        message: emailContent,
        _template: "table",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Formspree rejeitou a candidatura:", response.status, errorText);
      return false;
    }

    await response.json().catch(() => null);
    return true;
  } catch (error) {
    console.error("Erro ao enviar notificação por email:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = MentorshipApplicationSchema.safeParse(body);

    if (!validationResult.success) {
      return createErrorResponse(
        "Dados inválidos",
        400,
        validationResult.error.flatten()
      );
    }

    const application = validationResult.data;

    // Send notification email (async, don't wait)
    const notificationSent = await sendNotificationEmail(application);

    if (!notificationSent) {
      return createErrorResponse("Não foi possível enviar a notificação por email. Tente novamente em instantes.", 502);
    }

    return NextResponse.json({
      success: true,
      applicationId: null,
      message: "Candidatura recebida com sucesso! Entraremos em contato em breve.",
      nextSteps: [
        "Análise inicial da sua candidatura",
        "Contato via email em até 48h úteis",
        "Entrevista breve para alinhamento",
        "Definição do início da mentoria"
      ]
    });

  } catch (error) {
    console.error("Erro geral ao processar candidatura:", error);
    return createErrorResponse("Erro interno do servidor", 500);
  }
}
