import { NextPageContext } from 'next'
import config from '../../config'
import Bot from '../../interfaces/bot.interface'
import Layout from '../../layout'
import styles from "../../styles/pages/bot.module.scss"
import Link from "next/link"
import Markdown from '../../components/Markdown/Markdown'
interface Props {
    bot: Bot
}

function BotPage({ bot }: Props) {
    return (
        <Layout>
            <div className={styles.info}>
                <img className={styles.avatar} src={bot.avatar} />
                <div>
                    <div className={styles.name}>{bot.name}</div>
                    <div className={styles.tags}>
                        {bot.tags.map(({ name }) => 
                        <Link href={`/tags/${name}`}>
                            {name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase()}
                        </Link>)}
                    </div>
                    <div className={styles.links}>
                        <Link href={bot.inviteURL || ""}><img src="/assets/add-bot.svg" /></Link>
                        <Link href={bot.supportServerURL || ""}><img src="/assets/discord-logo.svg" /></Link>
                        <Link href={bot.githubURL || ""}><img src="/assets/github-logo.svg" /></Link>
                        <Link href={bot.websiteURL || ""}><img src="/assets/link.svg" /></Link>
                    </div>
                    <div className={styles.additional}>
                        <div>Префикс: <span>{bot.prefix}</span></div>
                        <div>Библиотека: <span>{bot.library}</span></div>
                        <div className={styles.developers}>Разработчики: 
                            <Link href={"gfgfdgdfgdg"}>
                                <img src={"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1cfd14ac-65a4-4aee-b7a4-6ad431b66e96/d5lj8b8-a92dfc1d-110e-4bce-9a6c-e67199fbb495.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzFjZmQxNGFjLTY1YTQtNGFlZS1iN2E0LTZhZDQzMWI2NmU5NlwvZDVsajhiOC1hOTJkZmMxZC0xMTBlLTRiY2UtOWE2Yy1lNjcxOTlmYmI0OTUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.yNpxHFoe8F1JweiPsGHD3CuxAN-S7M9fygLz3Ux8_UQ"} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Markdown className={styles.description} text={bot.description} />
            <div className={styles.comments}>
                <h3>Комментарии ({bot.comments.length})</h3>
            </div>
        </Layout>
    )
}

BotPage.getInitialProps = async ({ query }: NextPageContext) => {
    const { botid } = query
    const res = await fetch(`${config.SERVER_URL}/bots/${botid}`)
    const bot = await res.json()
    return { bot }
}

export default BotPage
