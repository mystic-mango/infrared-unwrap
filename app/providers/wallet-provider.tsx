'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { ReactNode, useState } from 'react';
import { berachain } from 'wagmi/chains';

// Set up the config
const config = createConfig({
  chains: [berachain],
  transports: {
    [berachain.id]: http(),
  },
  connectors: [injected()],
});

// Create the provider
export function WalletProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
} 