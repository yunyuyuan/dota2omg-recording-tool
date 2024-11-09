import "~/styles/globals.css";
import { SnackbarProvider, useSnackbar, type SnackbarKey } from 'notistack';
import type { AppProps } from 'next/app'
import Head from "next/head";
import { IconButton } from "@mui/material";
import { CloseSharp } from "@mui/icons-material";

function SnackbarCloseButton({ snackbarKey }: { snackbarKey: SnackbarKey }) {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)}>
      <CloseSharp className="text-white" />
    </IconButton>
  );
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Dota2 OMG Recording Tool</title>
        <meta name="description" content="Dota2 OMG Recording Tool, help you record your Dota2 OMG game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SnackbarProvider action={snackbarKey => <SnackbarCloseButton snackbarKey={snackbarKey} />}>
        <Component {...pageProps} />
      </SnackbarProvider>
    </>
  )}