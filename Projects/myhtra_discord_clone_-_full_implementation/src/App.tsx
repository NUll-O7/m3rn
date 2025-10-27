import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { MyhtraApp } from "./components/MyhtraApp";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Authenticated>
        <MyhtraApp />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="w-full max-w-md mx-auto p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Myhtra</h1>
              <p className="text-gray-300">Connect with your community</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
      <Toaster theme="dark" />
    </div>
  );
}
