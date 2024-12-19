import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  res: NextResponse,
  { params }: { params: { email: string } }
) {
  const { email } = params;

  try {
    const userFoundOrNot = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (userFoundOrNot) {
      const updatedIncrement = await prisma.users.update({
        where: {
          email: email,
        },
        data: {
          count: userFoundOrNot.count + 1,
        },
      });

      if (updatedIncrement) {
        // console.log("updatedIncrement::::", updatedIncrement);

        return NextResponse.json({
          incrementApiStatus: "incremented",
          count: updatedIncrement.count,
          status: 200,
        });
      }
    }
    return NextResponse.json({
      apistatus: "user not found to increment apilimit count",
      status: 403,
    });
  } catch (error: any) {
    console.log("error in incrementApiLimit:", error.message);
  }
}
