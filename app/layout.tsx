import './globals.css';
import { WalletProvider } from './providers/wallet-provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Infrared Vault Unwrapper',
  description: 'Unwrap your Infrared Boyco vaults on Berachain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
