"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * SECURITY CHECK: Ensures only logged-in Admins can run these actions
 */
async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session;
}

/**
 * CREATE: Adds a new user to Supabase with a hashed password
 */
export async function createUser(formData: FormData) {
  await ensureAdmin();

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      username,
      password: hashedPassword,
      role,
    },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?success=true");
}

/**
 * UPDATE: Modifies existing user details (Name, Username, Role)
 */
export async function updateUser(userId: string, formData: FormData) {
  await ensureAdmin();

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const role = formData.get("role") as string;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      username,
      role,
    },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?updated=true");
}

/**
 * DELETE: Removes a user from the database
 */
export async function deleteUser(userId: string) {
  const session = await ensureAdmin();

  // Prevent an admin from deleting their own account accidentally
  if (session.user.id === userId) {
    throw new Error("Self-preservation: You cannot delete your own admin account.");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/users");
}