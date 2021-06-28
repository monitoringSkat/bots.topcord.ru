import Layout from '../layout'
import styles from '../styles/pages/home.module.css'
import Input from '../components/Input/Input'
import Link from 'next/link'
import config from '../config'
import Bot from '../interfaces/bot.interface'
import Bots from '../components/Bots/Bots'
interface Props {
    bots: Bot[]
}

const Home = ({ bots }: Props) => (
    <Layout title="Главная">
        <div className={styles.intro}>
            <div className={styles.text}>
                <div className={styles.title}>Лист ботов в Дискорд.</div>
                <div className={styles.subtitle}>
                    Добавляйте ботов, голосуйте за них. Выбирайте ботов. И все
                    это на TopCord.
                </div>
                <Input type="search" placeholder="Найти бота" />
                <div className={styles.tags}>
                    <Link href="/tags/fun">Fun</Link>
                    <Link href="/tags/moderation">Moderation</Link>
                </div>
            </div>
            <img src="/assets/wumpus-jet.png" className={styles.wumpus} />
        </div>
        <div className={styles.bots}>
            <h2>Новые боты</h2>
            <Bots bots={bots} />
        </div>
    </Layout>
)

Home.getInitialProps = async (): Promise<Props> => {
    const res = await fetch(`${config.SERVER_URL}/bots`)
    const bots = await res.json()
    return {
        bots: bots || []
    }
}

export default Home
