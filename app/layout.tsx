import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "./components/Nav";

export const metadata: Metadata = {
  title: "TaxRate — Sales tax rates, one API call away",
  description:
    "TaxRate is a simple sales tax rate lookup API. Send an address, get the combined rate back as JSON.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 py-8 mt-16">
          <div className="mx-auto max-w-6xl px-6 text-sm text-gray-500 flex flex-wrap gap-x-6 gap-y-2 justify-between">
            <span>© {new Date().getFullYear()} TaxRate (demo). Not real tax advice.</span>
            <span>A PM take-home scaffold · rates are illustrative</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
