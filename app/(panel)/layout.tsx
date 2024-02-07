import Navigation from "@/components/Navigation";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "სამართავი პანელი",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html lang="en" className="bg-gray-200">
      <body className={cn(inter.className)}>
        <Navigation currentUser={user} />

        <main className="mt-10">
          <div className="mx-auto  px-4 pb-12 sm:px-6 lg:px-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
