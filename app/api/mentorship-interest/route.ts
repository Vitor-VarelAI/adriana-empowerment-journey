import { NextRequest, NextResponse } from "next/server";

interface InterestPayload {
  name: string;
  email: string;
  phone: string;
  goal: string;
  goalOther?: string | null;
  experience: string;
  readiness: string;
}

function createError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

async function sendNotification(data: InterestPayload) {
  const { NEXT_PUBLIC_FORMSPREE_ID } = process.env;

  if (!NEXT_PUBLIC_FORMSPREE_ID) {
    console.warn("FORMSPREE_ID não configurado - respostas não foram enviadas por email");
    return null;
  }

  const goalMap: Record<string, string> = {
    "desenvolvimento-pessoal": "Desenvolvimento pessoal",
    "lideranca-performance": "Liderança & Performance",
    "equilibrio-vida-trabalho": "Equilíbrio vida-trabalho",
    outro: "Outro"
  };

  const experienceMap: Record<string, string> = {
    "ja-investeu": "Já investi em coaching/mentoria antes",
    "primeira-vez": "É a minha primeira vez",
    "a-explorar": "Estou a explorar opções"
  };

  const readinessMap: Record<string, string> = {
    "quero-avancar": "Sim, quero avançar já",
    "a-avaliar": "Talvez, ainda estou a avaliar",
    "sem-planos": "Não tenho planos no imediato"
  };

  const readable = {
    goal:
      data.goal === "outro"
        ? `Outro: ${data.goalOther ?? "(sem detalhe)"}`
        : goalMap[data.goal] ?? data.goal,
    experience: experienceMap[data.experience] ?? data.experience,
    readiness: readinessMap[data.readiness] ?? data.readiness
  };

  const message = `\nNOVA RESPOSTA - QUESTIONÁRIO DE QUALIFICAÇÃO\n\n🙋 Nome: ${data.name}\n📧 Email: ${data.email}\n📱 Telefone: ${data.phone}\n\n🎯 Objetivo principal: ${readable.goal}\n📈 Experiência anterior: ${readable.experience}\n🚀 Disponibilidade: ${readable.readiness}\n\nEnviado em: ${new Date().toLocaleString("pt-PT", { timeZone: "Europe/Lisbon" })}\n`.trim();

  const response = await fetch(`https://formspree.io/f/${NEXT_PUBLIC_FORMSPREE_ID}`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      subject: "Nova resposta - Questionário Mentoria Outubro",
      message,
      nome: data.name,
      email: data.email,
      phone: data.phone,
      goal: readable.goal,
      experience: readable.experience,
      readiness: readable.readiness
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Falha ao enviar notificação por email:", response.status, errorText);
    throw new Error("Não foi possível enviar a notificação por email.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<InterestPayload>;

    if (!payload.name?.trim()) {
      return createError("Indique o seu nome.", 422);
    }

    if (!payload.email?.trim()) {
      return createError("Indique um email válido.", 422);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
      return createError("Formato de email inválido.", 422);
    }

    if (!payload.goal || !payload.experience || !payload.readiness) {
      return createError("Preencha todas as respostas obrigatórias.", 422);
    }

    if (payload.goal === "outro" && !payload.goalOther?.trim()) {
      return createError("Descreva o objetivo na opção 'Outro'.", 422);
    }

    if (!payload.phone?.trim()) {
      return createError("Indique um telefone válido.", 422);
    }

    const cleanPhone = payload.phone.trim();
    const numericDigits = cleanPhone.replace(/\D/g, "");
    if (numericDigits.length < 9) {
      return createError("Telefone deve ter pelo menos 9 dígitos.", 422);
    }

    const data: InterestPayload = {
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: cleanPhone,
      goal: payload.goal,
      goalOther: payload.goal === "outro" ? payload.goalOther?.trim() ?? "" : null,
      experience: payload.experience,
      readiness: payload.readiness
    };

    await sendNotification(data).catch(error => {
      console.error("Erro ao enviar notificação (background):", error);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar questionário:", error);
    return createError("Erro interno do servidor", 500);
  }
}
