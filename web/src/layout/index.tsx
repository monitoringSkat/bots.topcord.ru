import { FC } from 'react'
import Head from 'next/head'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

interface Props {
    title?: string
    description?: string
    image?: string
}

const Layout: FC<Props> = ({ children, title, description, image }) => (
    <div>
        <Head>
            <title>{title || 'TOPCORD'}</title>
            {/* Meta */}
            <meta http-equiv="content-language" content="ru" />
            <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
            />

            <meta
                name="keywords"
                content="discord, дискорд, дискорд боты, боты дискорд, лист ботов дискорд, русские дискорд боты, список ботов дискорд, топовые боты дискорд, bots discord, discord bots"
            />
            <meta name="description" content={description} />

            <meta name="msapplication-tooltip" content={`${title} | TopCord`} />
            <meta name="msapplication-starturl" content="/" />
            <meta name="msapplication-TileColor" content="#7289DA" />
            <meta name="theme-color" content="#7289DA" />
            <meta name="application-name" content={`${title} | TopCord`} />

            <meta property="og:site_name" content="bots.topcord.ru" />
            <meta property="og:title" content={`${title} | TopCord`} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://bots.topcord.ru/" />

            <link
                rel="shortcut icon"
                href="/assets/favicon.png"
                type="image/x-icon"
            />
        </Head>
        <Header></Header>
        <div style={{ minHeight: '80vh' }}>{children}</div>
        <Footer></Footer>
    </div>
)

export default Layout
