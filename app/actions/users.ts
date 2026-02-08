"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session;
}

export async function createUser(formData: FormData) {
  await ensureAdmin();

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, username, password: hashedPassword, role },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?success=true");
}

export async function updateUser(userId: string, formData: FormData) {
  await ensureAdmin();

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const role = formData.get("role") as string;
  
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const updateData: any = {
    name,
    username,
    role,
  };

  // Validation: Return an object with an error string instead of throwing
  if (password || confirmPassword) {
    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }
    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }
    updateData.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?updated=true");
}

export async function deleteUser(userId: string) {
  const session = await ensureAdmin();
  if (session.user.id === userId) {
    throw new Error("Self-preservation: You cannot delete your own admin account.");
  }
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}

// Add this function if it was missing from the file context but needed for profile updates
export async function changeOwnPassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmNewPassword = formData.get("confirmNewPassword") as string;

  if (newPassword !== confirmNewPassword) redirect("/profile?error=match");
  if (newPassword.length < 6) redirect("/profile?error=length");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) redirect("/profile?error=incorrect");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword }
  });

  revalidatePath("/profile");
  redirect("/profile?success=true");
}