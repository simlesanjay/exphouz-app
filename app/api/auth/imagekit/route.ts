import ImageKit from "@imagekit/nodejs";
import { NextResponse } from "next/server";

// Initialize ImageKit with server-side keys
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
} as any);

export async function GET() {
    try {
        const authenticationParameters = imagekit.helper.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        console.error("ImageKit Auth Error:", error);
        return NextResponse.json(
            { error: "Failed to generate authentication parameters" },
            { status: 500 }
        );
    }
}
