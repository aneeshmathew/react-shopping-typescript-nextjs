import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/server/auth";
import LoginForm from "@/components/client/LoginForm";

export default async function Login() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-slate-400 mt-2">
              Sign in to your ShopNext account
            </p>
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
