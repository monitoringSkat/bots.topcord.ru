import Layout from '../layout'
import styles from '../styles/pages/home.module.css'
import Input from '../components/Input/Input'
import Link from 'next/link'
import config from '../config'
import Bot from '../interfaces/bot.interface'
import Bots from '../components/Bots/Bots'
import React, { useState } from 'react'
import SearchBotsInput from "../components/SearchBotsInput/SearchBotsInput"

interface Props {
    topBots: Bot[]
    newBots: Bot[]
}

const Home = ({ newBots, topBots }: Props) => {
    const [sortCriteria, setSortCriteria] = useState<string | null>(null)
    const [sortLibrary, setSortLibrary] = useState<string | null>(null)
    const [sortTag, setSortTag] = useState<string | null>(null)

    return (
        <Layout title="Главная">
            <div className={styles.intro}>
                <div className={styles.text}>
                    <div className={styles.title}>Лист ботов в Дискорд.</div>
                    <div className={styles.subtitle}>
                        Добавляйте ботов, голосуйте за них. Выбирайте ботов. И
                        все это на TopCord.
                    </div>
                    <SearchBotsInput placeholder="Найти бота" />
                    <div className={styles.tags}>
                        <Link href="/bots?tag=fun">Fun</Link>
                        <Link href="/bots?tag=moderation">Moderation</Link>
                        <Link href="/tags">Список тегов</Link>
                    </div>
                </div>
                <img src="/assets/wumpus-jet.png" className={styles.wumpus} />
            </div>
            <div className={styles.bots}>
                {newBots.length === 0 && topBots.length === 0 && (
                    <div className={styles.empty}>Лист ботов пуст!</div>
                )}
                {newBots.length > 0 && (
                    <>
                        <h2>Новые боты</h2>
                        <Bots bots={newBots} />
                    </>
                )}

                {topBots.length > 0 && (
                    <>
                        <h2>Топ боты</h2>
                        <Bots bots={newBots} />
                    </>
                )}
            </div>
        </Layout>
    )
}
Home.getInitialProps = async (): Promise<Props> => {
    const res = await fetch(`${config.SERVER_URL}/bots`)
    const bots = await res.json()
    return bots
}

export default Home
