import '@/styles/globals.css';
import '@/styles/extras.tailwind.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from '@/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--inter-font',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${inter.variable}`}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
          <Toaster />
          <ToastContainer />
          <Component {...pageProps} />
          {/* </ThemeProvider> */}
        </PersistGate>
      </Provider>
    </main>
  );
}
