import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { stat } from "fs";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  {
    params,
  }: { params: { userid: string; healthcondition: string; delval: string } }
) {
  console.log(params);
  const { userid, healthcondition, delval } = params;

  const user_id = await prisma.users.findUnique({
    where: {
      email: userid,
    },
  });

  const uid = Number(user_id?.id);

  const existingUser = await prisma.healthprofile.findUnique({
    where: { user_id: uid }, //have to replace in future for authentication//
  });

  console.log((existingUser as any)?.[healthcondition]);

  let filteredVal: string[] = (existingUser as any)?.[healthcondition];
  let finalFilter = filteredVal.filter((val) => val !== delval);
  console.log("filtered value:", finalFilter);

  const successfulDeletion = await prisma.healthprofile.update({
    where: { user_id: uid }, //have to replace in future for authentication//
    data: {
      [healthcondition]: finalFilter,
    },
  });
  console.log("successful deletion:", successfulDeletion);
  if (successfulDeletion) {
    return NextResponse.json({ editedData: successfulDeletion, status: 200 });
  }
  return NextResponse.json({ message: "error in deletion", status: 500 });
}
