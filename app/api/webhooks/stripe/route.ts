import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendBookingEmail, BookingEmailData } from "../../_lib/notifications";


const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        // @ts-expect-error -- API version not yet typed in this SDK version
        apiVersion: "2024-12-18.acacia",
    });

    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    let event: Stripe.Event;

    try {
        if (!sig || !endpointSecret) {
            throw new Error("Missing signature or secret");
        }
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`);
        return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        // Retrieve metadata from the session (or payment_intent if needed)
        // We stored it in session.metadata and payment_intent_data.metadata
        const metadata = session.metadata;

        if (metadata && metadata.customerEmail) {
            const bookingData: BookingEmailData = {
                name: metadata.customerName || "Cliente",
                email: metadata.customerEmail,
                sessionType: (metadata.sessionType as "online" | "presencial") || "online",
                plan: (metadata.plan as "single" | "pack4" | "pack10") || "single",
                date: metadata.date,
                time: metadata.time,
                note: metadata.note,
            };

            console.log("Payment confirmed. Sending email for:", bookingData.email);
            await sendBookingEmail(bookingData);
        }
    }

    return NextResponse.json({ received: true });
}
