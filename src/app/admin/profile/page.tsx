"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { AdminCard } from "@/components/admin/AdminShell";

type Profile = {
  title: string; phone?: string | null; location?: string | null; bio?: string | null; company?: string | null;
  website?: string | null; avatarUrl: string; addressLine?: string | null; city?: string | null; country: string;
  user?: { email: string; name: string; role: string };
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/profile", { cache: "no-store" }).then((res) => res.json().then((data) => {
      if (!res.ok) setError(data.error ?? "Unable to load profile");
      else setProfile(data);
    }));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error ?? "Unable to save profile");
    setProfile((current) => ({ ...current, ...data }));
    setSaved(true);
  }

  if (error) return <AdminCard><p className="text-[#ef4444]">{error}</p></AdminCard>;
  if (!profile) return <AdminCard><p className="text-[#5a6a85bf]">Loading profile...</p></AdminCard>;

  return (
    <div className="grid grid-cols-12 gap-6">
      <AdminCard className="col-span-12 lg:col-span-4">
        <div className="text-center">
          <Image src={profile.avatarUrl} width={96} height={96} alt="Profile" className="mx-auto rounded-full" />
          <h2 className="mt-4 text-xl font-semibold">{profile.user?.name || "Admin User"}</h2>
          <p className="text-sm text-[#5a6a85bf]">{profile.user?.email}</p>
          <p className="mt-2 text-sm font-semibold text-[#5d87ff]">{profile.title}</p>
        </div>
      </AdminCard>
      <AdminCard className="col-span-12 lg:col-span-8">
        <h3 className="mb-5 text-lg font-semibold">Profile Details</h3>
        {saved && <p className="mb-4 rounded-md bg-[#dcfce7] p-3 text-sm text-[#15803d]">Profile saved.</p>}
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          {["title", "phone", "location", "company", "website", "addressLine", "city", "country", "avatarUrl"].map((name) => (
            <input key={name} name={name} defaultValue={String(profile[name as keyof Profile] ?? "")} placeholder={name} className="rounded-md border border-[#dfe5ef] px-4 py-3" />
          ))}
          <textarea name="bio" defaultValue={profile.bio ?? ""} placeholder="Bio" className="min-h-32 rounded-md border border-[#dfe5ef] px-4 py-3 md:col-span-2" />
          <button className="rounded-md bg-[#5d87ff] px-5 py-3 font-semibold text-white md:col-span-2">Save Profile</button>
        </form>
      </AdminCard>
    </div>
  );
}
