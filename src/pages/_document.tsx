import { useChangeTheme } from '@/lib/hooks/useChangeTheme';
import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
 
    return (
        <Html data-theme="cupcake">
            <Head>
                <body>
                    <Main />
                    <NextScript></NextScript>

                </body>
            </Head>
        </Html>
    )
}