import type { AppProps } from 'next/app';
import React, { useState, useEffect, useRef, useMemo } from 'react';

import {
	createAuthenticationAdapter,
	RainbowKitAuthenticationProvider,
	AuthenticationStatus,
	getDefaultWallets,
	RainbowKitProvider,
	darkTheme,
} from '@rainbow-me/rainbowkit';

// Wagmi Imports
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

// swie Imports
import { SiweMessage } from 'siwe';

// Styles
import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

// Configure Wagmi
const { chains, provider } = configureChains(
	[polygon, polygonMumbai],
	[publicProvider()]
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
	const fetchingStatusRef = useRef(false);
	const verifyingRef = useRef(false);
	const [authStatus, setAuthStatus] = useState<AuthenticationStatus>('loading');

	// Fetch user when:
	useEffect(() => {
		const fetchStatus = async () => {
			if (fetchingStatusRef.current || verifyingRef.current) {
				return;
			}

			fetchingStatusRef.current = true;

			try {
				const response = await fetch('/api/me');
				const json = await response.json();
				setAuthStatus(json.address ? 'authenticated' : 'unauthenticated');
			} catch (_error) {
				setAuthStatus('unauthenticated');
			} finally {
				fetchingStatusRef.current = false;
			}
		};

		// 1. page loads
		fetchStatus();

		// 2. window is focused (in case user logs out of another window)
		window.addEventListener('focus', fetchStatus);
		return () => window.removeEventListener('focus', fetchStatus);
	}, []);

	const authAdapter = useMemo(() => {
		return createAuthenticationAdapter({
			getNonce: async () => {
				const response = await fetch('/api/nonce');
				return await response.text();
			},

			createMessage: ({ nonce, address, chainId }) => {
				return new SiweMessage({
					domain: window.location.host,
					address,
					statement: 'Sign in with Ethereum to the app.',
					uri: window.location.origin,
					version: '1',
					chainId,
					nonce,
				});
			},

			getMessageBody: ({ message }) => {
				return message.prepareMessage();
			},

			verify: async ({ message, signature }) => {
				verifyingRef.current = true;

				try {
					const response = await fetch('/api/verify', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ message, signature }),
					});

					const authenticated = Boolean(response.ok);

					if (authenticated) {
						setAuthStatus(authenticated ? 'authenticated' : 'unauthenticated');
					}

					return authenticated;
				} catch (error) {
					return false;
				} finally {
					verifyingRef.current = false;
				}
			},

			signOut: async () => {
				setAuthStatus('unauthenticated');
				await fetch('/api/logout');
			},
		});
	}, []);

	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitAuthenticationProvider
				adapter={authAdapter}
				status={authStatus}
			>
				<RainbowKitProvider
					chains={chains}
					theme={darkTheme({
						accentColor: '#8B5CF6',
						accentColorForeground: 'white',
						borderRadius: 'medium',
						fontStack: 'system',
						overlayBlur: 'none',
					})}
				>
					<Component {...pageProps} />
				</RainbowKitProvider>
			</RainbowKitAuthenticationProvider>
		</WagmiConfig>
	);
}
