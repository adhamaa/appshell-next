import { appConfig } from '@/config/app';
import '@/styles/globals.css';
import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers as QueryProviders } from './providers';
import AppSidebar from '@/components/Sidebar/index.';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
};

const theme = createTheme({
  colors: {
    primary: [
      appConfig.colors.primary[50],
      appConfig.colors.primary[100],
      appConfig.colors.primary[200],
      appConfig.colors.primary[300],
      appConfig.colors.primary[500],
      appConfig.colors.primary[600],
      appConfig.colors.primary[700],
      appConfig.colors.primary[800],
      appConfig.colors.primary[900],
      appConfig.colors.primary[950],
    ],
  },
  fontFamily: 'inherit',
  primaryColor: 'primary',
  primaryShade: 4,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <QueryProviders>
            <AppSidebar>
              {children}
            </AppSidebar>
          </QueryProviders>
        </MantineProvider>
      </body>
    </html>
  );
}
