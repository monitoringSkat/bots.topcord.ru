import Layout from '../layout'
import styles from '../styles/pages/home.module.css'
import Link from 'next/link'
import config from '../config'
import Bot from '../interfaces/bot.interface'
import Bots from '../components/Bots/Bots'
import SearchBotsInput from '../components/SearchBotsInput/SearchBotsInput'
import { Container, Col, Row } from 'react-bootstrap'
interface Props {
    topBots: Bot[]
    newBots: Bot[]
}

const Home = ({ newBots, topBots }: Props) => (
    <Layout title="Главная | Topcord">
        <Container className={styles.intro} fluid>
            <Row>
                <Col className="col-sm-8 col-md-6 col-xl-6">
                    <div className={styles.title}>Лист ботов в Дискорд.</div>
                    <div className={styles.subtitle}>
                        Добавляйте ботов, голосуйте за них. Выбирайте ботов. И
                        все это на TopCord.
                    </div>
                    <SearchBotsInput placeholder="Найти бота" />
                    <div className={styles.tags}>
                        <Link href="/tags/fun">Fun</Link>
                        <Link href="/tags/moderation">Moderation</Link>
                        <Link href="/tags">Список тегов</Link>
                    </div>
                </Col>
                <Col className="col-sm-8 col-md-6 col-xl-6">
                    <img
                        src="/assets/wumpus-jet.png"
                        className={styles.wumpus}
                    />
                </Col>
            </Row>
        </Container>
        <div className={styles.bots}>
            {newBots.length === 0 && topBots.length === 0 && (
                <div className={styles.empty}>
                    ¯\_(ツ)_/¯ <br /> Боты не найдены.{' '}
                </div>
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

Home.getInitialProps = async (): Promise<Props> => {
    const res = await fetch(`${config.SERVER_URL}/bots`)
    const bots = await res.json()
    return bots
}

export default Home
