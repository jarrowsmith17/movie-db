import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditUserForm from "@/components/EditUserForm"; // Import the new component

export default async function EditUserPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) notFound();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-md mx-auto">
        <Link href="/admin/users" className="text-zinc-500 hover:text-white transition text-sm">
          ← Back to List
        </Link>
        <h1 className="text-3xl font-black mt-2 mb-8">Edit User</h1>

        {/* Render the Client Component */}
        <EditUserForm user={user} />
      </div>
    </div>
  );
}