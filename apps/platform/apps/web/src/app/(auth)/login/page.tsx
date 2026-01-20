"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                if (result.error === "invalid-credentials") {
                    setError("Invalid email or password");
                } else if (result.error === "exceeded-login-attempts") {
                    setError("Too many login attempts. Please try again later.");
                } else if (result.error === "email-not-verified") {
                    setError("Please verify your email address first.");
                } else {
                    setError("An error occurred. Please try again.");
                }
            } else {
                router.push(callbackUrl);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl });
    };

    return (
        <div className="flex min-h-screen w-full bg-white font-sans text-[#10161e]">
            {/* Left Panel */}
            <div className="flex w-full flex-col justify-between p-8 lg:w-[45%] xl:w-[40%] relative z-10">
                {/* Top Left Placeholder / Logo */}
                <div className="h-6 w-full" />

                {/* Main Form Container */}
                <div className="mx-auto w-full max-w-[400px] flex flex-col justify-center">

                    {/* Header */}
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-[26px] font-medium leading-[34px] tracking-[-0.078px]">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-[14px] leading-[20px] text-[#3a4455] tracking-[-0.042px]">
                            Let's get you selling and spin up outreach across every channel
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-[14px]">
                            {error}
                        </div>
                    )}

                    {/* Google Sign In Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="mb-4 flex h-10 w-full items-center justify-center gap-2 rounded-[6px] border border-[#eef0f2] bg-white text-[14px] font-medium shadow-[0px_1px_2px_0px_rgba(25,34,46,0.08)] hover:bg-gray-50 transition-colors"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#eef0f2]" />
                        </div>
                        <div className="relative flex justify-center text-[12px]">
                            <span className="bg-white px-2 text-[#3a4455]">or continue with email</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full">
                        {/* Work Email */}
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-[14px] leading-[20px] mb-1.5"
                                style={{ fontWeight: 400 }}
                            >
                                Work email
                            </label>
                            <div className="h-8 w-full rounded-[4px] border border-[#eef0f2] px-1 shadow-[0px_1px_2px_0px_rgba(25,34,46,0.08)]">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-full w-full bg-transparent px-2 text-[14px] outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="password"
                                    className="block text-[14px] leading-[20px]"
                                    style={{ fontWeight: 400 }}
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[14px] leading-[18.5px] text-[#0066ff]"
                                >
                                    Reset password
                                </Link>
                            </div>
                            <div className="h-8 w-full rounded-[4px] border border-[#eef0f2] px-1 shadow-[0px_1px_2px_0px_rgba(25,34,46,0.08)]">
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-full w-full bg-transparent px-2 text-[14px] outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative flex h-8 w-full items-center justify-center rounded-[6px] bg-[#2f6feb] text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05),0px_0px_0px_1px_rgba(16,24,40,0.1)] hover:bg-[#2558bc] transition-colors disabled:opacity-50"
                        >
                            <span className="text-[14px] leading-[20px] font-medium">
                                {isLoading ? "Signing in..." : "Log in"}
                            </span>
                        </button>
                    </form>

                    {/* Separator */}
                    <div className="my-[25px] h-[1px] w-full bg-[#f4f4f5]" />

                    {/* Marketing/Signup Area */}
                    <div className="flex h-[64px] w-full items-center rounded-[8px] bg-white p-4 shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03),0px_12px_16px_-4px_rgba(16,24,40,0.08)] border border-[#eef0f2]">
                        <div className="flex flex-col">
                            <span className="text-[14px] font-medium leading-[20px]">
                                Don't have an account?
                            </span>
                            <Link href="/register" className="text-[14px] leading-[20px] text-[#0066ff]">
                                Create an account
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex w-full justify-between items-center text-[14px] text-[#3a4455]">
                    <span>© 2026 LeadSwap</span>
                    <Link href="/support" className="text-[#3a4455]">Customer support</Link>
                </div>
            </div>

            {/* Right Panel */}
            <div className="relative hidden w-0 flex-1 lg:block bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Quote / Testimonial */}
                <div className="absolute bottom-[80px] left-0 right-0 mx-auto w-full max-w-[500px] text-center px-8">
                    {/* NEW Badge */}
                    <div className="mx-auto mb-6 w-max rounded-full bg-[#e8f1ff] px-2 py-0.5 text-[11px] font-medium text-[#0066ff]">
                        NEW
                    </div>

                    {/* Heading */}
                    <h2 className="mb-4 text-[24px] font-medium leading-[32px] tracking-[-0.096px] text-[#10161e]">
                        Build sequences faster with AI
                    </h2>

                    {/* Testimonial */}
                    <div className="mx-auto max-w-[400px] text-[14px] leading-[20px] text-[#3a4455]">
                        "The AI sequences are amazing! It cuts down on the amount of manual work when sending emails and also increases deliverability."
                    </div>
                </div>
            </div>
        </div>
    );
}
