import { getServerSession } from "next-auth/next";
import { authOptions, handler } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import { PrismaClient, product } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextApiRequest,
  { params }: { params: { email: string } }
) {
  try {
    const { email } = params;
    console.log("email in api/stripe/route:", email);

    const existingUser = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return NextResponse.json({
        mess: "user not found in the server backend",
        status: 500,
      });
    }

    const userSubscription = await prisma.usersubscription.findUnique({
      where: {
        email: email,
      },
    });
    
    console.log(
      "existuser,usersubscripton:",
      existingUser,
      userSubscription?.stripecustomerid
    );

    if (userSubscription && userSubscription.stripecustomerid) {
      console.log("inside the if blcok");

      console.log(userSubscription.stripecustomerid);

      const stripeSession = await stripe.billingPortal.sessions.create({
        customer:userSubscription.stripecustomerid,
        return_url:'http://localhost:3000/upgrade'
      })
      console.log('stripe session:',stripeSession);



      return NextResponse.json({
        url: JSON.stringify(stripeSession.url),
        status: 200,
      });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: "http://localhost:3000/scan",
      cancel_url: "http://localhost:3000/scan",
      payment_method_types: ["card", "paypal"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "foodvitals-ai pro",
              description: "unlimited scans",
            },
            unit_amount: 200,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        email,
      },
    });

    return NextResponse.json({
      url: JSON.stringify(stripeSession.url),
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      error: "some error in server",
      status: 500,
    });
  }
}
