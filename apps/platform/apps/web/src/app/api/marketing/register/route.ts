
import { NextResponse } from "next/server";
import { prisma } from "@leadswap/prisma";

export async function OPTIONS() {
    const response = new NextResponse(null, {
        status: 200,
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        // Basic validation
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            const response = NextResponse.json({ error: "Valid email is required" }, { status: 400 });
            response.headers.set('Access-Control-Allow-Origin', '*');
            return response;
        }

        // Check if already exists
        const existing = await prisma.waitingList.findUnique({
            where: { email },
        });

        if (existing) {
            const response = NextResponse.json({ message: "You are already on the waiting list! We'll be in touch." }, { status: 200 });
            response.headers.set('Access-Control-Allow-Origin', '*');
            return response;
        }

        await prisma.waitingList.create({
            data: {
                email,
                source: 'marketing_drop'
            },
        });

        const response = NextResponse.json({ message: "Due to high traffic, you've been added to our exclusive waiting list. We'll notify you soon!" }, { status: 201 });
        response.headers.set('Access-Control-Allow-Origin', '*');
        return response;

    } catch (error) {
        console.error("Marketing register error:", error);
        const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        response.headers.set('Access-Control-Allow-Origin', '*');
        return response;
    }
}
