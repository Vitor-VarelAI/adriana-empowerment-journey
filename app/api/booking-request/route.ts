import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BookingRequestSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  sessionType: z.enum(["online", "presencial"]).default("online"),
  plan: z.enum(["single", "pack4", "pack10"]).default("single"),
  date: z.string().optional(),
  time: z.string().optional(),
  note: z.string().optional(),
});

function createError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

async function sendEmail(data: z.infer<typeof BookingRequestSchema>) {
  const { NEXT_PUBLIC_FORMSPREE_ID } = process.env;

  if (!NEXT_PUBLIC_FORMSPREE_ID) {
    console.warn("FORMSPREE_ID não configurado - pedido não enviado por email");
    return false;
  }

  const format = (value?: string | null) => (value && value.trim().length > 0 ? value.trim() : "Não indicado");
  const sessionLabel = data.sessionType === "presencial" ? "Presencial" : "Online";
  const planMap: Record<typeof data.plan, string> = {
    single: "Sessão Única (70€)",
    pack4: "Pacote de 4 Sessões (280€)",
    pack10: "Pacote de 10 Sessões (700€)",
  };
  const planLabel = planMap[data.plan] ?? data.plan;

  const message = `\nNOVA SOLICITAÇÃO DE AGENDAMENTO\n\n🙋 Nome: ${format(data.name)}\n📧 Email: ${format(data.email)}\n🧭 Tipo de sessão: ${sessionLabel}\n📦 Plano selecionado: ${planLabel}\n📅 Data preferida: ${format(data.date)}\n🕒 Horário preferido: ${format(data.time)}\n📝 Mensagem: ${format(data.note)}\n\nEnviado em: ${new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })}\n`.trim();

  const response = await fetch(`https://formspree.io/f/${NEXT_PUBLIC_FORMSPREE_ID}`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject: `Novo pedido de agendamento - ${data.name}`,
      message,
      nome: data.name,
      email: data.email,
      sessao: sessionLabel,
      plano: planLabel,
      data_preferida: format(data.date),
      horario_preferido: format(data.time),
      observacoes: format(data.note),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Formspree rejeitou o pedido de booking:", response.status, errorText);
    return false;
  }

  await response.json().catch(() => null);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = BookingRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return createError("Dados inválidos", 422);
    }

    const emailSent = await sendEmail(parsed.data);

    if (!emailSent) {
      return createError("Não foi possível enviar o pedido por email. Tente novamente.", 502);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar pedido de booking:", error);
    return createError("Erro interno do servidor", 500);
  }
}
