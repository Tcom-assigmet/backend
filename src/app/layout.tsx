import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "./Mainlayout";
import { LoggerProvider } from "@/src/providers/LoggerProvider";
import { loggerConfig } from "@/src/configs/logger.config";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eqs-dba",
  description: "novigi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased` }>
        <LoggerProvider
          instrumentationKey={loggerConfig.instrumentationKey}
          enableConsoleLogging={loggerConfig.enableConsoleLogging}
          enableRemoteLogging={loggerConfig.enableRemoteLogging}
          logLevel={loggerConfig.logLevel}
          customProperties={loggerConfig.customProperties}
        >
          <MainLayout>{children}</MainLayout>
        </LoggerProvider>
      </body>
    </html>
  );
}
