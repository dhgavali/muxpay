import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arcTestnet } from './chains';

export const config = getDefaultConfig({
  appName: 'MuxPay',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains: [arcTestnet],
  ssr: true,
});
