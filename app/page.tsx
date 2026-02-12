"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      fetchBookmarks();

      const channel = supabase
        .channel("realtime-bookmarks")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "bookmarks" },
          () => {
            fetchBookmarks();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  const addBookmark = async () => {
    if (!title || !url) return;

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: session.user.id,
      },
    ]);

    setTitle("");
    setUrl("");
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({ provider: "google" })
          }
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Smart Bookmark App</h1>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-red-500"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 flex-1"
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 flex-1"
        />
        <button
          onClick={addBookmark}
          className="bg-green-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="flex justify-between border p-3 mb-2 rounded"
        >
          <a
            href={bookmark.url}
            target="_blank"
            className="text-blue-600"
          >
            {bookmark.title}
          </a>
          <button
            onClick={() => deleteBookmark(bookmark.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
