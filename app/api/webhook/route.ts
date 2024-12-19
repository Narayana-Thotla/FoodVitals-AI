import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest, params: any) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`webhook error:${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.email) {
      return new NextResponse("user is required:", { status: 400 });
    }

    await prisma.usersubscription.create({
      data: {
        email: session?.metadata?.email,
        stripesubscriptionid: subscription.id,
        stripecustomerid: subscription.customer as string,
        stripepriceid: subscription.items.data[0].price.id,
        stripecurrentperiodend: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.usersubscription.update({
      where: {
        stripesubscriptionid: subscription.id,
      },
      data: {
        stripepriceid: subscription.items.data[0].price.id,
        stripecurrentperiodend: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new NextResponse(null,{status:200});
  
}
