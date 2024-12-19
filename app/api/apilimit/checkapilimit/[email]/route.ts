import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { email: any } }
) {
  const { email } = params;
  // console.log("email of user in checkapilimit:", email, params);

  try {
    const checkedApiLimit = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    // console.log("checked api limit in route:", checkedApiLimit);

    if (checkedApiLimit) {
      const getCount: any = checkedApiLimit.count || 0;

      const userSubscription = await prisma.usersubscription.findUnique({
        where: {
          email: email,
        },
      });

      if (userSubscription) {
        const subscriptionEndDate = new Date(
          userSubscription?.stripecurrentperiodend || ""
        ); 
        const currentDate = Date.now();

        if (currentDate < subscriptionEndDate.getTime()) {
          return NextResponse.json({
            message: "valid for free tier",
            count: getCount,
            status: 202,
          });
        }
      }

      

      if ( getCount >= 5) {
        return NextResponse.json({
          error: "free tier is up",
          count: getCount,
          status: 403,
        });
      } else {
        return NextResponse.json({
          message: "valid for free tier",
          count: getCount,
          status: 200,
        });
      }
    }
    return NextResponse.json({
      error: "user not found",
      status: 500,
    });
  } catch (error: any) {
    console.log("error in checkApiLimit:", error.message);
  }
}
