import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { email: any; decodedText: string } }
): Promise<any> {
  const { email, decodedText } = params;
  // console.log(decodedText);
  // console.log(process.env.DB_URL_PASSWORD);

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${decodedText}`
    );
    const data = await response.json();
    const dataFormat = await JSON.stringify(data);

    if (data.status === 1) {
      // console.log("Product Found:", data.code);
      // return data.product;
      createProduct(data, email);
      // console.log("dataformat in route.js:", data.product.product_name);

      return NextResponse.json({ data: `${dataFormat}` }, { status: 200 });
    } else {
      // console.error("Product not found.");
      return NextResponse.json({ message: "data not found" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
}

const createProduct = async (data: any, email: any) => {
  const finduser = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  const idOfUser = finduser?.id;
  // console.log('id of user in get ingredients:',idOfUser,email);

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

//(edited using response instead of nextresponse)//
//-------------------------------------------------------------------------------

// import { NextRequest } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { email: string; decodedText: string } }
// ): Promise<Response> {
//   const { email, decodedText } = params;

//   try {
//     // Fetch product details from external API
//     const response = await fetch(
//       `https://world.openfoodfacts.org/api/v0/product/${decodedText}`
//     );

//     // If the external API fetch fails, return an error response
//     if (!response.ok) {
//       return new Response(
//         JSON.stringify({ message: "Failed to fetch product data" }),
//         { status: 500, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // Parse the fetched data
//     const data = await response.json();

//     // If the product is found, proceed with creating the product in the database
//     if (data.status === 1) {
//       // Await the asynchronous product creation
//       await createProduct(data, email);

//       // Return the fetched product data as a JSON response
//       return new Response(JSON.stringify({ data }), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       });
//     } else {
//       // If product not found, return a not found message
//       return new Response(JSON.stringify({ message: "Product not found" }), {
//         status: 404,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   } catch (error) {
//     // Catch and log any errors, then return a server error response
//     console.error("Error in GET handler:", error);
//     return new Response(
//       JSON.stringify({ message: "Internal server error" }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }

// // Function to create a product in the database
// const createProduct = async (data: any, email: string) => {
//   try {
//     // Find user by email
//     const user = await prisma.users.findUnique({ where: { email } });

//     if (!user) {
//       console.error("User not found");
//       return; // If no user is found, stop further execution
//     }

//     // Create product in the database
//     await prisma.product.create({
//       data: {
//         user_id: user.id, // Link product to the user
//         product_code: data.product.code,
//         product_name: data.product.product_name,
//         product_image_url: data.product.image_url,
//         product_ingredients: data.product.ingredients_text,
//       },
//     });
//   } catch (error) {
//     // Log any errors encountered while creating the product
//     console.error("Error creating product:", error);
//   }
// };
