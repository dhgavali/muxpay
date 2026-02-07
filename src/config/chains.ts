import { Chain } from 'wagmi/chains'

export const arcTestnet: Chain = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ARC_RPC_URL || 'https://rpc-testnet.arc.network'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_ARC_RPC_URL || 'https://rpc-testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Arc Explorer', url: 'https://explorer-testnet.arc.network' },
  },
  testnet: true,
}
