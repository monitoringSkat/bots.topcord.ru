import { FC } from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Head from "next/head"
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
            <meta httpEquiv="content-language" content="ru" />
            <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
            />
            <link rel="preconnect" href="https://cdn.discordapp.com"/>
            <link rel="preconnect" href="https://media.discordapp.net"/>
            <link rel="manifest" href="/manifest"/>

            <meta name="keywords"
                  content="дискорд, discord, боты дискорд, дискорд боты, боты для дискорда, скачать бота дискорд, скачать дискорд, лист ботов дискорд, топ ботов дискорд, русские боты дискорд, список русских ботов дискорд, лучшие боты дискорд, discord bots, bots discord, top bots, discordbots, botsfordiscord, cool discord bots, Лист ботов дискорд, Список ботов для дискорд, мониторинг ботов в дискорд, topcord" />
            <meta name="description" content={description} />

            <meta name="msapplication-tooltip" content={`${title}`} />
            <meta name="msapplication-starturl" content="/" />
            <meta name="msapplication-TileColor" content="#7289DA" />
            <meta name="theme-color" content="#7289DA" />
            <meta name="application-name" content={`${title}`} />

            <meta property="og:site_name" content="bots.topcord.ru" />
            <meta property="og:title" content={`${title}`} />
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
