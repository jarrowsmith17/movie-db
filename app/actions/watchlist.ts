"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function toggleWatchlist(tmdbId: number, type: 'MOVIE' | 'TV', title: string, poster: string | null) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check if it's already in the watchlist
  const existing = await prisma.watchlist.findUnique({
    where: {
      userId_tmdbId_type: {
        userId: session.user.id,
        tmdbId,
        type
      }
    }
  });

  if (existing) {
    // Remove it
    await prisma.watchlist.delete({
      where: { id: existing.id }
    });
    revalidatePath("/watchlist");
    // Return false to indicate it is NOT in watchlist anymore
    return false; 
  } else {
    // Add it
    await prisma.watchlist.create({
      data: {
        userId: session.user.id,
        tmdbId,
        type,
        title,
        poster
      }
    });
    revalidatePath("/watchlist");
    // Return true to indicate it IS in watchlist now
    return true;
  }
}