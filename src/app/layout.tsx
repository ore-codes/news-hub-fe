import type { Metadata } from "next";
import { PropsWithChildren } from 'react';
import "./globals.css";
import { GlobalHeader } from "@/components/GlobalHeader";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "News Hub",
  description: "News Hub",
};

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: 'Geist, sans-serif' }}>
        <ReactQueryProvider>
          <GlobalHeader />
          {props.children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
