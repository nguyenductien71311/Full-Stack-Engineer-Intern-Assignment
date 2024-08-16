import { prisma } from "@/model/prisma";
import { NextResponse } from "next/server";

// Get comment of one picture
// GET /api/comment/:photoId
export const GET = async (request: Request, { params }: { params: { photoId: string } }) => {
    const photoId = params.photoId
    
    try {       
        const comments = await prisma.comment.findMany({
            where: {
                photoId: Number(photoId),
            },
        });

        return NextResponse.json(
            {message: "Success", comments},
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {message: "Error", error},
            {
                status: 500,
            }
        );
    }
}

// Create comment for one picture
// POST /api/comment/:photoId
export const POST = async (req: Request, { params }: { params: { photoId: string } }) => {
    const photoId = params.photoId
    const { data } = await req.json();

    try {
        const comment = await prisma.comment.create({
            data: {
                data,
                photoId: Number(photoId),
            },
        });

        return NextResponse.json(
            {message: "Success", comment},
            {
                status: 201,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {message: "Error", error},
            {
                status: 500,
            }
        );
    }
}