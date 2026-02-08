import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { changeOwnPassword } from "@/app/actions/users";
import Navbar from "@/components/Navbar";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProfilePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  if (!session) {
    redirect("/login");
  }

  // Handle URL Error/Success States
  const error = params.error;
  const success = params.success;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 mt-12">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-8 border-l-4 border-yellow-500 pl-6">
          My Profile
        </h1>

        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full mx-auto flex items-center justify-center text-3xl font-black text-black mb-4">
              {session.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <h2 className="text-xl font-bold text-white">{session.user?.name}</h2>
            <p className="text-gray-500 text-sm">@{session.user?.username || "username"}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-gray-800 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
              {session.user?.role}
            </span>
          </div>

          <hr className="border-gray-800 my-8" />

          <h3 className="text-lg font-bold text-white mb-6">Change Password</h3>

          {/* Error/Success Alerts */}
          {error === 'incorrect' && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium mb-4 text-center">
              Current password is incorrect.
            </div>
          )}
          {error === 'match' && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium mb-4 text-center">
              New passwords do not match.
            </div>
          )}
           {error === 'length' && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium mb-4 text-center">
              Password must be at least 6 characters.
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl text-sm font-medium mb-4 text-center">
              Password updated successfully.
            </div>
          )}

          <form action={changeOwnPassword} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Current Password</label>
              <input 
                type="password" 
                name="currentPassword" 
                required 
                className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl outline-none focus:border-yellow-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">New Password</label>
              <input 
                type="password" 
                name="newPassword" 
                required 
                className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl outline-none focus:border-yellow-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Confirm New Password</label>
              <input 
                type="password" 
                name="confirmNewPassword" 
                required 
                className="w-full bg-gray-950 border border-gray-800 p-3 rounded-xl outline-none focus:border-yellow-500 transition-colors"
              />
            </div>

            <button 
              type="submit" 
              className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-transform active:scale-95 shadow-lg shadow-yellow-500/20"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}