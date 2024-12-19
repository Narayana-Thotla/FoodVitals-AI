import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";

// export async function GET(req:NextRequest,{ params }: {params:{}}) {
//   console.log(process.env.OPENAI_API_KEY);

//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   });
//   console.log('openai details:!!:',openai)

//   const completion = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "user", content: "color of mango" }],
//   });

//   console.log(completion)

//   return NextResponse.json({message:'completion',status:200})
// }

//------------------------------------------------------------------------

// pages/api/chatgpt.js

export async function GET(req: NextRequest) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use an environment variable
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-1106", // Specify the model, e.g., gpt-3.5-turbo or gpt-4
        messages: [{ role: "user", content: "color of mango" }],
      }),
    });

    // console.log(response);

    const data = await response.json();
    // console.log('data in openai:',data)

    if (!response.ok) {
      return NextResponse.json({
        error: data.error.message || "Failed to communicate with OpenAI",
        status: 500,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    return NextResponse.json({
      error: "Failed to communicate with OpenAI",
      status: 500,
    });
  }
}
