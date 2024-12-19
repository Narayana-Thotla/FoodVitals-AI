import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type hecon = {
  id: String;
  allergies: String[];
  chronicConditions: String[];
  pastSurgeries: String[];
  dietaryPreferences: String[];
  familyMedicalHistory: String[];
  createdAt: string;
  updatedAt: string;
};

export async function POST(
  req: NextRequest,
  { params }: { params: { userid: string; healthcondition: string } }
) {
  const { userid, healthcondition } = params;
  // console.log("userid val in health profile router:", userid);

  // const allergy = req.body
  // console.log("its going inside the allergy route!!!");

  const body = await req.json();
  const { inputval } = body;
  // console.log("inputval:", inputval);

  const user_id = await prisma.users.findUnique({
    where: {
      email: userid,
    },
  });

  const uid = Number(user_id?.id);

  let existingProfile = await prisma.healthprofile.findUnique({
    where: { user_id: uid }, //have to replace in future for authentication//
  });

  if (!existingProfile) {
    existingProfile = await prisma.healthprofile.create({
      data: {
        user_id: uid,
      },
    });
    // return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  }

  // if (!(healthcondition in existingProfile)) {
  //   return NextResponse.json(
  //     { message: "Profile in healcon in existpro not found" },
  //     { status: 404 }
  //   );
  // }

  // Combine existing allergies with the new one
  // const existingConditions = [...(existingProfile?.{healthcondition} || []), inuptval];
  const existingConditions: any =
    existingProfile[healthcondition as keyof hecon] || [];
  const updatedField = [...existingConditions, inputval];

  // Update the profile
  const updatedProfile = await prisma.healthprofile.update({
    where: { user_id: uid }, //have to replace in future for authentication//
    data: {
      [healthcondition]: updatedField,
    },
  });

  // console.log("balh blah blah:", existingConditions, updatedField);

  if (updatedProfile) {
    // console.log("user health added created successfully!!");
    return NextResponse.json(
      { message: "allergy added successfully!!" },
      { status: 200 }
    );
  }

  return NextResponse.json({ message: "error in adding !!" }, { status: 500 });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userid: string; healthcondition: string } }
) {
  const { userid, healthcondition } = params;

  const user_id = await prisma.users.findUnique({
    where: {
      email: userid,
    },
  });

  const uid = Number(user_id?.id);

  // console.log('uid in healthconsiditno route:',userid,user_id,uid);

  const hpData = await prisma.healthprofile.findMany({
    where: { user_id: uid }, //have to replace in future for authentication//
  });

  const data = JSON.stringify(hpData);
  const jsonData = JSON.parse(data);

  if (hpData) {
    // console.log("healthprofile data found in the db:", jsonData[0]);
    return NextResponse.json({ data: data }, { status: 200 });
  }
  return NextResponse.json(
    { message: "error in response from db in getting data!!" },
    { status: 500 }
  );
}
