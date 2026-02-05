"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAllAsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
  
  revalidatePath("/inbox");
}