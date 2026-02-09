import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { changeOwnPassword, updateOwnProfile, deleteOwnAccount } from "@/app/actions/users";
import Navbar from "@/components/Navbar";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EditProfilePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  if (!session) redirect("/login");

  const error = params.error;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-black italic uppercase tracking-tighter border-l-4 border-yellow-500 pl-6">
             Account Settings
           </h1>
           <Link href="/profile" className="text-sm text-gray-400 hover:text-white font-bold uppercase tracking-widest transition-colors">
             &larr; Back to Profile
           </Link>
        </div>

        {/* --- SECTION 1: EDIT DETAILS --- */}
        <section className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl mb-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          </div>
          
          {error === 'username_taken' && <ErrorMessage>Username is already taken.</ErrorMessage>}
          {error === 'incorrect_password' && <ErrorMessage>Incorrect password provided.</ErrorMessage>}

          <form action={updateOwnProfile} className="flex flex-col gap-6">
            <div className="grid md:grid-cols-2 gap-6">
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Display Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    defaultValue={session.user?.name || ""} 
                    required 
                    className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-gray-500"
                    placeholder="Your Name"
                  />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Username</label>
                  <div className="relative">
                     <span className="absolute left-3 top-3.5 text-gray-500 text-sm font-bold">@</span>
                     <input 
                       type="text" 
                       name="username" 
                       defaultValue={session.user?.username || ""} 
                       required 
                       className="w-full bg-gray-800 border border-gray-700 text-white p-3 pl-8 rounded-xl outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-gray-500"
                       placeholder="username"
                     />
                  </div>
               </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
               <label className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2 block">
                  Confirm Password to Save Changes
               </label>
               <input 
                 type="password" 
                 name="currentPassword" 
                 required 
                 className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-yellow-500 transition-colors"
                 placeholder="Enter your current password"
               />
            </div>

            <button 
              type="submit" 
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-transform active:scale-[0.98] shadow-lg shadow-yellow-500/20"
            >
              Save Profile Changes
            </button>
          </form>
        </section>

        {/* --- SECTION 2: CHANGE PASSWORD --- */}
        <section className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl mb-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Change Password</h2>
          </div>

          {error === 'match' && <ErrorMessage>New passwords do not match.</ErrorMessage>}
          {error === 'length' && <ErrorMessage>Password must be at least 6 characters.</ErrorMessage>}
          {error === 'incorrect' && <ErrorMessage>Current password is incorrect.</ErrorMessage>}

          <form action={changeOwnPassword} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Password</label>
              <input 
                type="password" 
                name="currentPassword" 
                required 
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl outline-none focus:border-white transition-all"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Password</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  required 
                  className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl outline-none focus:border-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmNewPassword" 
                  required 
                  className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl outline-none focus:border-white transition-all"
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs border border-gray-700 hover:border-gray-600 transition-all active:scale-[0.98]"
            >
              Update Password
            </button>
          </form>
        </section>

        {/* --- SECTION 3: DANGER ZONE --- */}
        <section className="bg-red-500/5 p-8 rounded-2xl border border-red-900/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
          </div>

          <h2 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
             Danger Zone
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md leading-relaxed">
             Permanently delete your account and all associated data (logs, reviews, watchlist). <br/>
             <span className="font-bold text-red-400">This cannot be undone.</span>
          </p>

          {error === 'incorrect_delete_password' && <ErrorMessage>Incorrect password. Cannot delete account.</ErrorMessage>}

          <form action={deleteOwnAccount} className="flex flex-col gap-4 relative z-10">
            <div>
               <label className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 block">
                  Enter Password to Confirm Deletion
               </label>
               <input 
                 type="password" 
                 name="currentPassword" 
                 required 
                 className="w-full bg-red-950/30 border border-red-900/50 text-red-200 p-3 rounded-xl outline-none focus:border-red-500 placeholder-red-900/50 transition-colors"
                 placeholder="Your password"
               />
            </div>
            <button 
              type="submit" 
              className="bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-transform active:scale-[0.98] shadow-lg shadow-red-600/20 w-full"
            >
               Delete Account Permanently
            </button>
          </form>
        </section>

      </div>
    </div>
  );
}

const ErrorMessage = ({ children }: { children: React.ReactNode }) => (
   <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-bold mb-6 text-center shadow-lg shadow-red-500/5 flex items-center justify-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {children}
   </div>
);