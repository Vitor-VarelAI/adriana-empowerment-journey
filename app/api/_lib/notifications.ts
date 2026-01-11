export interface BookingEmailData {
    name: string;
    email: string;
    sessionType: "online" | "presencial";
    plan: "single" | "pack4" | "pack10";
    date?: string;
    time?: string;
    note?: string;
}

export async function sendBookingEmail(data: BookingEmailData) {
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

    const message = `\nNOVA SOLICITAÇÃO DE AGENDAMENTO (PAGO)\n\n🙋 Nome: ${format(data.name)}\n📧 Email: ${format(data.email)}\n🧭 Tipo de sessão: ${sessionLabel}\n📦 Plano selecionado: ${planLabel}\n📅 Data preferida: ${format(data.date)}\n🕒 Horário preferido: ${format(data.time)}\n📝 Mensagem: ${format(data.note)}\n\nEnviado em: ${new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })}\n`.trim();

    try {
        const response = await fetch(`https://formspree.io/f/${NEXT_PUBLIC_FORMSPREE_ID}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subject: `Novo agendamento pago - ${data.name}`,
                message,
                nome: data.name,
                email: data.email,
                sessao: sessionLabel,
                plano: planLabel,
                data_preferida: format(data.date),
                horario_preferido: format(data.time),
                observacoes: format(data.note),
                status_pagamento: "CONFIRMADO",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Formspree rejeitou o pedido de booking:", response.status, errorText);
            return false;
        }

        await response.json().catch(() => null);
        return true;
    } catch (error) {
        console.error("Erro ao enviar email Formspree:", error);
        return false;
    }
}
