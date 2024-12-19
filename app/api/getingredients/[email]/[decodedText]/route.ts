import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { email: any; decodedText: string } }
) {
  const { email, decodedText } = params;
  console.log(decodedText);
  console.log(process.env.DB_URL_PASSWORD);

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${decodedText}`
    );
    const data = await response.json();
    const dataFormat = await JSON.stringify(data);

    if (data.status === 1) {
      console.log("Product Found:", data.code);
      // return data.product;
      createProduct(data, email);
      console.log("dataformat in route.js:", data.product.product_name);

      return NextResponse.json({ data: `${dataFormat}` }, { status: 200 });
    } else {
      console.error("Product not found.");
      return NextResponse.json({ message: "data not found" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }

  // Example response using the 'id' parameter
}

const createProduct = async (data: any, email: any) => {
  const finduser = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  const idOfUser = finduser?.id;
  console.log('id of user in get ingredients:',idOfUser,email);
  
  if (data && idOfUser) {
    const newUser = await prisma.product.create({
      data: {
        user_id: idOfUser, // have to make changes for authentication//
        product_code: data.product.code,
        product_name: data.product.product_name,
        product_image_url: data.product.image_url,
        product_ingredients: data.product.ingredients_text,
      },
    });
    if (newUser) {
      console.log("user product created successfully!!");
    }
  } else {
    console.log(" error in creating product");
  }
};
