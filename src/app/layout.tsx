import type { Metadata } from "next";
import { PropsWithChildren } from 'react';
import { Geist } from "next/font/google";
import "./globals.css";
import { GlobalHeader } from "@/components/GlobalHeader";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "News Hub",
  description: "News Hub",
};

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <ReactQueryProvider>
          <GlobalHeader />
          {props.children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
