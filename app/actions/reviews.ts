"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function logAndReview(
  tmdbId: number,
  type: "MOVIE" | "TV",
  date: Date,
  title: string,
  posterPath: string | null,
  rating?: number,
  review?: string
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // 1. Create Log Entry (History)
  await prisma.watchLog.create({
    data: {
      userId: session.user.id,
      tmdbId,
      type,
      watchedAt: date,
      title,
      posterPath,
    },
  });

  // 2. Remove from Watchlist (if exists)
  await prisma.watchlist.deleteMany({
    where: {
      userId: session.user.id,
      tmdbId,
      type,
    },
  });

  // 3. Upsert Review (State)
  if (rating || review) {
    await prisma.review.upsert({
      where: {
        userId_tmdbId_type: {
          userId: session.user.id,
          tmdbId,
          type,
        },
      },
      update: {
        rating: rating || undefined,
        content: review || undefined,
      },
      create: {
        userId: session.user.id,
        tmdbId,
        type,
        rating: rating || 0,
        content: review || "",
      },
    });
  }

  revalidatePath(`/movie/${tmdbId}`);
  revalidatePath(`/tv/${tmdbId}`);
  revalidatePath(`/watchlist`);
  revalidatePath(`/log`);
  
  return { success: true };
}

// --- UPDATED DELETE FUNCTION ---
export async function deleteLog(logId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // 1. Find the log first to identify the Movie/TV Show
  const logEntry = await prisma.watchLog.findUnique({
    where: { id: logId },
    select: { tmdbId: true, type: true, userId: true }
  });

  // Security Check: Ensure log exists and belongs to user
  if (!logEntry || logEntry.userId !== session.user.id) {
    throw new Error("Log not found or unauthorized");
  }

  // 2. Delete the associated Review
  // We use deleteMany so it doesn't throw an error if a review doesn't exist
  await prisma.review.deleteMany({
    where: {
      userId: session.user.id,
      tmdbId: logEntry.tmdbId,
      type: logEntry.type,
    },
  });

  // 3. Delete the Log Entry
  await prisma.watchLog.delete({
    where: { id: logId },
  });

  // 4. Refresh pages
  revalidatePath("/log");
  revalidatePath(`/movie/${logEntry.tmdbId}`);
  revalidatePath(`/tv/${logEntry.tmdbId}`);
}