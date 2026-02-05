'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/");
      router.refresh();
    } else {
      alert("Access Denied: Invalid Credentials");
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-black text-yellow-500 uppercase tracking-tighter mb-2">Elite Access</h1>
        <p className="text-gray-500 text-sm mb-8 font-medium italic">Private Media Server Gateway</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Username</label>
            <input 
              type="text" 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>
          <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-lg uppercase tracking-widest transition-all">
            Enter Vault
          </button>
        </form>
      </div>
    </main>
  );
}