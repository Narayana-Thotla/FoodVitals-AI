import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { userid: any } }
) {
  const { userid } = params;

  // console.log(process.env.OPENAI_API_KEY);
  let productIngredients = await req.json();
  console.log(productIngredients);

  // const res = await fetch(`/api/healthprofile/${userid}/all`);
  const res = await fetch(`/api/healthprofile/${userid}/all`, {
    method: "GET", // Explicitly specify the GET method
    headers: {
      "Content-Type": "application/json",
    },
  });
  

  console.log("res of healthprofile in gemini rouer:", res);
  const hpData = await res.json();
  const hpJSONData = await JSON.parse(hpData.data);

  if (!res.ok && !productIngredients) {
    return NextResponse.json({
      error: "error in fetching health profile data from server",
      status: 500,
    });
  }

  // console.log("hpdata in gemini route:", hpJSONData);
  let combinedArray: string[] = [];

  // Iterate over the parsed data and extract values
  hpJSONData.forEach((item: any) => {
    combinedArray = combinedArray.concat(
      item.allergies || [],
      item.chronicConditions || [],
      item.pastSurgeries || [],
      item.dietaryPreferences || [],
      item.familyMedicalHistory || []
    );
  });

  // console.log(combinedArray);

  const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_API_KEY}`);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `give me the advantages , disadvantages and health profile of the following ingredients one by one precisely ${productIngredients}`;
  const summaryPrompt = `based on the following ingredients ${productIngredients} and the health conditions/problems/issues i.e ${combinedArray} ,give me a summary in two line for the consumer.`;
  const healthRating = `for the following ingredients ${productIngredients} and the health conditions/problems/issues i.e ${combinedArray} give me only a  number between 1-100 where 100 is bad and 1 is good indicating its health rating,`;

  const result = await model.generateContent(prompt);
  const googleResponse = await result.response.text();

  const summaryResult = await model.generateContent(summaryPrompt);
  const googleSummaryResponse = await summaryResult.response.text();

  const googleHealthResult = await model.generateContent(healthRating);
  const googleHealthResponse = await googleHealthResult.response.text();

  // console.log("google-Gemini-response!!!:", result.response.text());

  return NextResponse.json({
    message: googleResponse,
    summary: googleSummaryResponse,
    healthrating: googleHealthResponse,
    status: 200,
  });
}
