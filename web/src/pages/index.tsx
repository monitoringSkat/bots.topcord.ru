import Layout from '../layout'
import styles from '../../styles/pages/home.module.css'
import Link from 'next/link'
import config from '../config'
import Bot from '../interfaces/bot.interface'
import Bots from '../components/Bots/Bots'
import SearchBotsInput from '../components/SearchBotsInput/SearchBotsInput'
import { Container, Col, Row } from 'react-bootstrap'
import http from '../api/http'
import { useTranslation } from 'react-i18next'
interface Props {
    topBots: Bot[]
    newBots: Bot[]
}

const Home = ({ newBots, topBots }: Props) => {
    const { t } = useTranslation()
    return (
        <Layout title="Главная" description="Bots.topcord.ru - мониторинг ботов дискорд. Вы можете подобрать для своего сервера бота из нашего списка, найти его в поиске, либо по тегам. " image="/assets/favicon.png" >
            <Container className={styles.intro} fluid>
                <Row>
                    <Col className={styles.search}>
                        <div className={styles.title}>{t('title')}</div>
                        <div className={styles.subtitle}>{t('subtitle')}</div>
                        <SearchBotsInput placeholder={t('inputs.searchBot')} />
                        <div className={styles.tags}>
                            <Link href="/tags">{t('tagList')}</Link>
                        </div>
                    </Col>
                    <Col className={styles.wumpus_col}>
                        <img
                            src="/assets/wumpus-jet.png"
                            className={`${styles.wumpus} mx-auto d-block`}
                            alt="Wumpus Jet"
                        />
                    </Col>
                </Row>
            </Container>
            <div className={styles.bots}>
                {newBots.length === 0 && topBots.length === 0 && (
                    <div className={styles.empty}>
                        ¯\_(ツ)_/¯ <br /> {t('errors.botsNotFound')}{' '}
                    </div>
                )}
                {newBots.length > 0 && (
                    <>
                        <h2>{t('newBots')}</h2>
                        <Bots bots={newBots} />
                    </>
                )}

                {topBots.length > 0 && (
                    <>
                        <hr className={styles.hr} />
                        <h2>{t('topBots')}</h2>
                        <Bots bots={topBots} />
                    </>
                )}
            </div>
        </Layout>
    )
}

Home.getInitialProps = async (): Promise<Props> => {
    const topBots = await http.get(`/bots/top?limit=20`)
    const newBots = await http.get(`/bots/new?limit=4`)
    return { topBots: topBots.data, newBots: newBots.data }
}

export default Home
