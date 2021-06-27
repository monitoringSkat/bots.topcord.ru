import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NextNprogress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }: AppProps) {
    return <>
        <NextNprogress
            color="#1d1f23"
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
            showOnShallow={true}
        />
        <Component {...pageProps} />
    </>
}
export default MyApp
