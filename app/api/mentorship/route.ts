import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/db/client";

const MentorshipApplicationSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(180),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos").max(20).optional(),
  currentProfession: z.string().min(1, "Profissão atual é obrigatória").max(200),
  currentChallenge: z.string().min(10, "Desafio atual deve ter pelo menos 10 caracteres").max(1000),
  mentorshipGoal: z.string().min(10, "Objetivo na mentoria deve ter pelo menos 10 caracteres").max(1000),
  timeCommitment: z.enum(["2-4h/semana", "4-6h/semana", "6-8h/semana", "+8h/semana"], {
    message: "Selecione uma opção de compromisso de tempo"
  }),
  supportLevel: z.enum(["orientação básica", "suporte regular", "acompanhamento intensivo"], {
    message: "Selecione um nível de suporte"
  }),
  availability: z.string().min(1, "Disponibilidade é obrigatória").max(200),
  expectations: z.string().min(10, "Expectativas devem ter pelo menos 10 caracteres").max(1000),
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
    return null;
  }

  try {
    const emailContent = `
NOVA CANDIDATURA - MENTORIA DE NOVEMBRO 2025

📋 DADOS PESSOAIS
Nome: ${application.name}
Email: ${application.email}
Telefone: ${application.phone || "Não informado"}

💼 PROFISSÃO E DESAFIOS
Profissão atual: ${application.currentProfession}
Desafio atual: ${application.currentChallenge}

🎯 OBJETIVOS E EXPECTATIVAS
Objetivo na mentoria: ${application.mentorshipGoal}
Expectativas: ${application.expectations}
Nível de suporte desejado: ${application.supportLevel}
Compromisso de tempo: ${application.timeCommitment}
Disponibilidade: ${application.availability}

📢 COMO CONHECEU
${application.howHeard || "Não informado"}

🔔 NEWSLETTER
${application.newsletter ? "Sim" : "Não"}

Enviado em: ${new Date().toLocaleString('pt-BR', { timezone: 'Europe/Lisbon' })}
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
      console.error("Falha ao enviar notificação por email:", response.status, response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar notificação por email:", error);
    return null;
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

    // Check if email already applied
    const { data: existingApplication, error: checkError } = await supabase
      .from("mentorship_applications")
      .select("id, status, created_at")
      .eq("email", application.email.toLowerCase())
      .maybeSingle();

    if (checkError) {
      console.error("Erro ao verificar candidatura duplicada:", checkError);
      return createErrorResponse("Erro ao processar candidatura", 500);
    }

    if (existingApplication) {
      const daysSinceLastApplication = Math.floor(
        (Date.now() - new Date(existingApplication.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastApplication < 7) {
        return createErrorResponse(
          "Você já enviou uma candidatura recentemente. Aguarde 7 dias para enviar uma nova.",
          429
        );
      }
    }

    // Store application
    const { data: insertedApplication, error: insertError } = await supabase
      .from("mentorship_applications")
      .insert({
        name: application.name,
        email: application.email.toLowerCase(),
        phone: application.phone || null,
        current_profession: application.currentProfession,
        current_challenge: application.currentChallenge,
        mentorship_goal: application.mentorshipGoal,
        time_commitment: application.timeCommitment,
        support_level: application.supportLevel,
        availability: application.availability,
        expectations: application.expectations,
        how_heard: application.howHeard || null,
        metadata: {
          newsletter: application.newsletter || false,
          userAgent: request.headers.get("user-agent"),
          ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
          submittedAt: new Date().toISOString(),
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erro ao salvar candidatura:", insertError);
      return createErrorResponse("Erro ao salvar candidatura", 500);
    }

    // Send notification email (async, don't wait)
    sendNotificationEmail(application).catch(error => {
      console.error("Erro ao enviar notificação (background):", error);
    });

    return NextResponse.json({
      success: true,
      applicationId: insertedApplication.id,
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