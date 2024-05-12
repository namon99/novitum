import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import * as mathjs from "mathjs";

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;