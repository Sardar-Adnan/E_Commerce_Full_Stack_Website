import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold">Leaf & Bloom</h1>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <footer className="p-4 border-t text-center text-sm">
        © Leaf & Bloom
      </footer>
    </div>
  );
}
