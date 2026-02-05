// app/actions/requests.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitRequest(mediaId: string, title: string, posterPath: string | null, type: 'MOVIE' | 'TV') {
  const session = await getServerSession(authOptions);

  // Safety check
  if (!session?.user?.id) {
    throw new Error("You must be logged in to request content.");
  }

  await prisma.request.create({
    data: {
      title,
      posterPath,
      tmdbId: parseInt(mediaId),
      type,
      status: "PENDING",
      userId: session.user.id,
    }
  });

  // Email Notification with safe username access
  if (process.env.RESEND_API_KEY) {
    try {
      // Use a type assertion to access 'username' safely
      const user = session.user as any; 
      
      await resend.emails.send({
        from: 'Movie-DB <onboarding@resend.dev>',
        to: 'jacob.arrowsmith17@gmail.com', // Replace with your email
        subject: `New Request: ${title}`,
        html: `
          <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 24px; border: 1px solid #27272a;">
            <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -1px; margin-bottom: 8px;">New Request</h1>
            <p style="color: #a1a1aa; font-size: 14px;">
              <strong>${user.name}</strong> (@${user.username || 'user'}) has requested a ${type.toLowerCase()}.
            </p>
            
            <div style="background: #18181b; padding: 20px; border-radius: 16px; margin: 24px 0; border: 1px solid #3f3f46;">
              <h2 style="margin: 0; font-size: 18px; color: #fff;">${title}</h2>
              <p style="font-size: 10px; color: #3b82f6; text-transform: uppercase; font-weight: 900; margin-top: 4px; letter-spacing: 1px;">${type}</p>
            </div>

            <a href="${process.env.NEXTAUTH_URL}/admin/requests" 
               style="background: #3b82f6; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 14px;">
               Manage Request
            </a>
          </div>
        `
      });
    } catch (error) {
      console.error("Email failed:", error);
    }
  }
  
  revalidatePath("/requests");
}

export async function updateRequestStatus(requestId: string, newStatus: "ADDED" | "REJECTED") {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const request = await prisma.request.update({
    where: { id: requestId },
    data: { status: newStatus },
    include: { user: true }
  });

  // Create a notification for the user
  await prisma.notification.create({
    data: {
      userId: request.userId,
      message: `Your request for "${request.title}" was ${newStatus.toLowerCase()}.`,
    }
  });

  revalidatePath("/admin/requests");
  revalidatePath("/requests");
  revalidatePath("/inbox");
}