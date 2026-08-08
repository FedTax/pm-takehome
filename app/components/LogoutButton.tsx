"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="text-sm text-gray-500 hover:text-ink underline underline-offset-2"
    >
      Sign out
    </button>
  );
}
