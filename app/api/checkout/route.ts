import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const CheckoutSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    sessionType: z.enum(["online", "presencial"]),
    plan: z.enum(["single", "pack4", "pack10"]),
    date: z.string().optional(),
    time: z.string().optional(),
    note: z.string().optional(),
});

const PLAN_PRICES = {
    single: { amount: 7000, name: "Sessão Única" }, // 70.00€
    pack4: { amount: 28000, name: "Pacote 4 Sessões" }, // 280.00€
    pack10: { amount: 70000, name: "Pacote 10 Sessões" }, // 700.00€
};

export async function POST(request: NextRequest) {
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        // @ts-expect-error -- API version not yet typed in this SDK version
        apiVersion: "2024-12-18.acacia",
    });

    try {
        const payload = await request.json();
        const parsed = CheckoutSchema.safeParse(payload);

        if (!parsed.success) {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
        }

        const { plan, email, name, ...metadata } = parsed.data;
        const selectedPlan = PLAN_PRICES[plan];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card", "multibanco"],

            payment_method_options: {
                mbway: {},
            } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: selectedPlan.name,
                            description: `Agendamento - ${name}`,
                        },
                        unit_amount: selectedPlan.amount,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${request.headers.get("origin")}/?success=true`,
            cancel_url: `${request.headers.get("origin")}/?canceled=true`,
            customer_email: email,
            metadata: {
                customerName: name,
                plan,
                ...metadata,
            },
            payment_intent_data: {
                metadata: {
                    customerName: name,
                    customerEmail: email,
                    plan,
                    ...metadata,
                },
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json(
            { error: "Erro ao iniciar pagamento" },
            { status: 500 }
        );
    }
}
