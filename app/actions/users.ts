"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- ADMIN HELPERS & ACTIONS ---

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

// --- USER PROFILE ACTIONS ---

export async function changeOwnPassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmNewPassword = formData.get("confirmNewPassword") as string;

  // Updated redirects to point to /profile/edit so the user stays on the form
  if (newPassword !== confirmNewPassword) redirect("/profile/edit?error=match");
  if (newPassword.length < 6) redirect("/profile/edit?error=length");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) redirect("/profile/edit?error=incorrect");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword }
  });

  revalidatePath("/profile");
  redirect("/profile?success=true");
}

export async function updateOwnProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const currentPassword = formData.get("currentPassword") as string;

  if (!name || !username || !currentPassword) {
    redirect("/profile/edit?error=missing");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");

  // Security Check: Confirm password before allowing profile changes
  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    redirect("/profile/edit?error=incorrect_password");
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, username },
    });
  } catch (error) {
    // Handle unique constraint violation (username taken)
    redirect("/profile/edit?error=username_taken");
  }

  revalidatePath("/profile");
  redirect("/profile?updated=true");
}

export async function deleteOwnAccount(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const currentPassword = formData.get("currentPassword") as string;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    redirect("/profile/edit?error=incorrect_delete_password");
  }

  // Transaction: Delete all related data first to avoid foreign key errors
  await prisma.$transaction([
    prisma.watchlist.deleteMany({ where: { userId: session.user.id } }),
    prisma.request.deleteMany({ where: { userId: session.user.id } }),
    prisma.notification.deleteMany({ where: { userId: session.user.id } }),
    prisma.watchLog.deleteMany({ where: { userId: session.user.id } }),
    prisma.review.deleteMany({ where: { userId: session.user.id } }),
    prisma.user.delete({ where: { id: session.user.id } }),
  ]);

  // Redirect to home page with a flag (NextAuth will handle the session invalidation separately or user will just be logged out on next check)
  redirect("/?accountDeleted=true");
}