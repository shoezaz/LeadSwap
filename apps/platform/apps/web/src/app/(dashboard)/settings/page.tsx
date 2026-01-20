"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function SettingsPage() {
  const { data: session, update, status } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        update();
        toast.success("Successfully updated your name!");
      } else {
        const { error } = await res.json();
        toast.error(error || "Failed to update name");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Profile</h2>

          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                maxLength={32}
              />
              <p className="mt-1 text-sm text-gray-500">Max 32 characters.</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={session?.user?.email || ""}
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm bg-gray-50 text-gray-500"
              />
              <p className="mt-1 text-sm text-gray-500">Email cannot be changed.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Account ID Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <div className="mt-1 flex items-center gap-2">
              <code className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-sm font-mono">
                {session?.user?.id || "Loading..."}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(session?.user?.id || "");
                  toast.success("Copied to clipboard!");
                }}
                className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white shadow rounded-lg p-6 border border-red-200">
          <h2 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => {
              toast.error("Account deletion is not yet implemented.");
            }}
            className="inline-flex justify-center rounded-md border border-red-300 bg-white py-2 px-4 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
