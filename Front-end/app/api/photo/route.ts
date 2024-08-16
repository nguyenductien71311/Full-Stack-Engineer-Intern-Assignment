import { prisma } from "@/model/prisma";
import { NextResponse } from "next/server";

// Get all photo
// GET /api/photo
export const GET = async (request: Request) => {
  try {
    const photos = await prisma.photo.findMany();

    return NextResponse.json(
      { message: "Success", photos },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error },
      {
        status: 500,
      }
    );
  }
};

// Create a photo
// POST /api/photo
export const POST = async (req: Request) => {
  const { url, caption } = await req.json();

  try {
    const photo = await prisma.photo.create({
        data: {
            url,
            caption,
        },
    });

    return NextResponse.json(
        { message: "Success", photo },
        {
          status: 201,
        }
      );
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error },
      {
        status: 500,
      }
    );
  }
};
