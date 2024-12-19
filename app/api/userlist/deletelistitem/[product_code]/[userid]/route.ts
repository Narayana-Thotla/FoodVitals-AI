import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, product } from "@prisma/client";

const prisma = new PrismaClient();

interface Product {
  id: number;
  user_id: number;
  product_code: string;
  product_name: string;
  product_image_url: string;
  product_ingredients: string | null;
  product_summary: string | null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { product_code: any; userid: any } }
) {
  const { product_code, userid } = params;
  const user_id = Number(userid);

  try {
    const userListInfo = await prisma.useraddedlist.findMany({
      where: {
        user_id: user_id,
      },
    });

    const filtered = userListInfo.filter((Item: any) => {
      return Item.product_code != product_code;
    });

    const deletedProduct = await prisma.useraddedlist.deleteMany({
      where: {
        user_id: user_id,
        product_code: product_code,
      },
    });

    if (deletedProduct.count > 0) {
      const remainingProducts = await prisma.useraddedlist.findMany({
        where: {
          user_id: user_id,
        },
      });

      if (deletedProduct && remainingProducts) {
        return NextResponse.json({
          message: "nice its doing fine",
          updatedList: `${JSON.stringify(remainingProducts)}`,
          status: 200,
        });
      }
      return NextResponse.json({
        error: "not able to find user_id or some other error in server",
        status: 500,
      });
    }

    return NextResponse.json({
      error: "no products in the wishlist!!",
      status: 202,
    });
  } catch (error: any) {
    console.log("error in deletelistitem:", error.message);
  }
}
