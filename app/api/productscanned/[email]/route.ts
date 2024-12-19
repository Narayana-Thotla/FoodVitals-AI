import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { email: any } }
) {
  try {
    const { email } = params;

    const userEmail = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (userEmail) {
      const products = await prisma.product.findMany({
        where: {
          user_id: userEmail?.id,
        },
      });
      const productToString = JSON.stringify(products);
      // console.log("products in db", products);

      return NextResponse.json(
        { productsInfo: `${productToString}` },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "error in findding user email/id data from db" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "error in retrieving data from db" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
