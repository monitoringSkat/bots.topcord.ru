import { FC } from 'react'
import Head from 'next/head'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

interface Props {
    title?: string
}

const Layout: FC<Props> = ({ children, title }) => (
    <div>
        <Head>
            <title>{title || 'TOPCORD'}</title>
            <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
            />
            <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
        </Head>
        <Header></Header>
        <div style={{ minHeight: '80vh' }}>{children}</div>
        <Footer></Footer>
    </div>
)

export default Layout
