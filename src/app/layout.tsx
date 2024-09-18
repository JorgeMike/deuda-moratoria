import type { Metadata } from "next";
import "@/styles/globals.scss";
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ["100", "300", '400', "500", "700", "900"],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Deuda Moratoria",
  description: "Aplicacion que genera deuda moratoria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-bs-theme="dark">
      <body  className={roboto.className}>
        {children}
      </body>
    </html>
  );
}
