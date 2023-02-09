import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
 
    return (
        <Html data-theme="bumblebee">
            <Head>
                <body className='overflow-hidden'>
                    <Main />                   
                  <NextScript></NextScript>
                </body>
            </Head>
        </Html>
    )
}