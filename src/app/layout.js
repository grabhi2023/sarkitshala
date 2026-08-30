import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header/Header.js";
import { ThemeProvider } from "@/components/theme-provider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Sarkitshala",
    template: "%s – Sarkitshala",
  },
  description: "Explore tutorials on IoT, Arduino, ESP32, Raspberry Pi, Jetson & more.",
  verification: {
    google: "9rETS0M62diUrVcnRPMv2Ro7G95p7O9p4-SW6F4jZQI",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
   <html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.variable} antialiased bg-background text-foreground`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <Header />
     
       {children}
    
        </ThemeProvider>
      </body>
    </html>
  );
}
