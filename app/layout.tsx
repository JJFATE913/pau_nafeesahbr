import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import ThemeRegistry from "@/components/ThemeRegistry";
import Box from "@mui/material/Box";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#08080A",
};

export const metadata: Metadata = {
  title: "Pau-Nafeesah Beauty Room",
  description:
    "Private beauty studio for lashes, makeup, powder brows, and epilations. Book an appointment and view the looks of our past satisfied customers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body>
        <ThemeRegistry>
          <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <NavBar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
