import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Azazel OSINT — Cyber Intelligence Platform",
    template: "%s | Azazel OSINT",
  },
  description:
    "Institutional open source intelligence platform. Search breach databases, analyze digital footprints, and monitor cyber threats with institutional-grade tools.",
  keywords: [
    "OSINT",
    "cyber intelligence",
    "breach detection",
    "data leak",
    "threat intelligence",
    "cybersecurity",
    "digital footprint",
  ],
  authors: [{ name: "Azazel OSINT" }],
  openGraph: {
    title: "Azazel OSINT — Cyber Intelligence Platform",
    description:
      "Institutional open source intelligence platform for breach detection and threat analysis.",
    type: "website",
    locale: "en_US",
    siteName: "Azazel OSINT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Azazel OSINT — Cyber Intelligence Platform",
    description:
      "Institutional open source intelligence platform for breach detection and threat analysis.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/azazel.gif",
    shortcut: "/azazel.gif",
    apple: "/azazel.gif",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased noise-overlay`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <TooltipProvider>
                {children}
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    style: {
                      background: "#0f0f13",
                      border: "1px solid #27272a",
                      color: "#fafafa",
                    },
                  }}
                />
              </TooltipProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
