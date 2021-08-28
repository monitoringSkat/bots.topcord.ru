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

            <meta name="keywords"
                  content="дискорд, discord, боты дискорд, дискорд боты, боты для дискорда, скачать бота дискорд, скачать дискорд, лист ботов дискорд, топ ботов дискорд, русские боты дискорд, список русских ботов дискорд, лучшие боты дискорд, discord bots, bots discord, top bots, discordbots, botsfordiscord, cool discord bots, Лист ботов дискорд, Список ботов для дискорд, мониторинг ботов в дискорд, topcord" />
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
            <script
            dangerouslySetInnerHTML={{
              __html: `
              <script async src="https://www.googletagmanager.com/gtag/js?id=UA-183237060-1">
              </script>
              <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              
                gtag('config', 'UA-183237060-1');
              </script>`
            }}
            />
            <script
            dangerouslySetInnerHTML={{
              __html: `
                <script async type="text/javascript" >
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                ym(70435240, "init", {
                        clickmap:true,
                        trackLinks:true,
                        accurateTrackBounce:true,
                        webvisor:true
                });
                </script>
                <noscript><div><img src="https://mc.yandex.ru/watch/70435240" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
                `
            }}
            />
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
