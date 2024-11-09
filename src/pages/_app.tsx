import "~/styles/globals.css";
import { NotificationsProvider } from '@toolpad/core/useNotifications';
import type { AppProps } from 'next/app'
import Head from "next/head";
 
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Dota2 OMG Recording Tool</title>
        <meta name="description" content="Dota2 OMG Recording Tool, help you record your Dota2 OMG game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NotificationsProvider>
        <Component {...pageProps} />
      </NotificationsProvider>
    </>
  )}