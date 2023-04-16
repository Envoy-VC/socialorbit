import type { AppProps } from 'next/app';

import {
	getDefaultWallets,
	RainbowKitProvider,
	Theme,
	darkTheme,
} from '@rainbow-me/rainbowkit';

// Wagmi Imports
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

// Styles
import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

// Configure Wagmi
const { chains, provider } = configureChains(
	[polygon, polygonMumbai],
	[
		alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY as string }),
		publicProvider(),
	]
);
const { connectors } = getDefaultWallets({
	appName: 'socialorbit',
	projectId: 'a709f7bd26a11c85a6bc50afe69aa418',
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				chains={chains}
				theme={darkTheme({
					accentColor: '#8B5CF6',
					accentColorForeground: 'white',
					borderRadius: 'medium',
					fontStack: 'system',
					overlayBlur: 'small',
				})}
			>
				<Component {...pageProps} />
			</RainbowKitProvider>
		</WagmiConfig>
	);
}
