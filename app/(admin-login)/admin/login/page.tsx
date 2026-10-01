"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { SocialLogin } from "@/lib/apicalls/login";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { setCookie } from "cookies-next";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      // console.log("ID Token:", idToken);

      const response = await SocialLogin({ idToken: idToken });
      // console.log("response in google login", response);

      if (response.success) {
        setCookie("accessToken", response.data.token, {
          maxAge: 60 * 60 * 24,
          path: "/",
          secure: true,
          sameSite: "lax",
        });
        toast.success("Login successful!");
        router.push("/admin");
      } else {
        toast.error(response?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C] text-white">
      <div className="bg-[#0A0F1C] rounded-2xl shadow-lg p-8 w-90">
        <div className="flex flex-col items-center space-y-2">
          <img
            src="/mysafety-logo.svg"
            alt="Mysafety logo"
            className="w-24 mb-2"
          />
          <h1 className="text-lg font-medium text-center">
            Login to Mysafety with Google
          </h1>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center w-full bg-[#FFD11A] hover:bg-[#ffcc00] text-black font-semibold py-3 rounded-full transition duration-300 cursor-pointer"
          >
            {loading ? "Signing in..." : (
              <>
                <FcGoogle size={22} className="mr-2" />
                Continue with Google
              </>
            )}
          </button>
        </div>

        <div className="text-center text-sm text-gray-400 mt-4">
          Your information is secure & protected
        </div>

        <div className="mt-10 text-xs text-gray-500 text-center">
          By continuing, you agree to our{" "}
          <span className="text-[#FFD11A] cursor-pointer">
            Terms & Conditions
          </span>
        </div>
      </div>
    </div>
  );
}
