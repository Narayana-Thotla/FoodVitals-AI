import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { userid: number } }
) {
  try {
    const { userid } = params;
    const user_id = Number(userid);
    const body = await req.json();
    const { scanListItem } = body;
    console.log(" val of userid in userlist route:!!", typeof user_id);

    // Fetch products from the database
    // const products = await prisma.product.findMany({});
    // const productToString = JSON.stringify(products)
    // console.log('products in db',products);

    if (scanListItem) {
      const newScanItem = await prisma.useraddedlist.create({
        data: {
          user_id: user_id,
          product_code: scanListItem.product_code,
          product_name: scanListItem.product_name,
          product_image_url: scanListItem.product_image_url,
        },
      });
    }

    return NextResponse.json(
      { message: `post is working in userlist route  :)` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "error in retrieving data from db" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userid: any } }
) {
  const { userid  }  = params;


  try {

    const findUserByEmail = await prisma.users.findUnique({
      where: {
        email: userid,
      },
    });

    const userListInfo = await prisma.useraddedlist.findMany({
      where: {
        user_id: findUserByEmail?.id,
      },
    });
    if (userListInfo) {
      const stringedData = JSON.stringify(userListInfo);
      return NextResponse.json({ userListInfo: stringedData, status: 200 });
    }
    return NextResponse.json({
      error: "not able to find user_id or some other error in server",
      status: 500,
    });
  } catch (error) {}
}
