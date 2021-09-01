import Layout from '../layout'
import styles from '../../styles/pages/home.module.css'
import Bot from '../interfaces/bot.interface'
import Bots from '../components/Bots/Bots'
import SearchBotsInput from '../components/SearchBotsInput/SearchBotsInput'
import { Container, Col, Row } from 'react-bootstrap'
import http from '../api/http'
import { useTranslation } from 'react-i18next'
import Button from '@material-ui/core/Button'
interface Props {
    topBots: Bot[]
    newBots: Bot[]
}

const Home = ({ newBots, topBots }: Props) => {
    const { t } = useTranslation()
    return (
        <Layout
            title="Лист ботов дискорд | TopCord"
            description="Bots.topcord.ru - мониторинг ботов дискорд. Вы можете подобрать для своего сервера бота из нашего списка, найти его в поиске, либо по тегам. "
            image="/assets/favicon.png"
        >
            <Container className={styles.intro} fluid>
                <Row>
                    <Col className={styles.search}>
                        <div className={styles.title}>{t('title')}</div>
                        <div className={styles.subtitle}>{t('subtitle')}</div>
                        <SearchBotsInput placeholder={t('inputs.searchBot')} />
                        <div className={styles.tags}>
                            <Button variant="contained" color="primary" href="/tags">{t('tagList')}</Button>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#5167B8"  fill-opacity="1" d="M0,224L48,197.3C96,171,192,117,288,133.3C384,149,480,235,576,245.3C672,256,768,192,864,165.3C960,139,1056,149,1152,160C1248,171,1344,181,1392,186.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
            <div className={styles.bots}>
                {newBots.length === 0 && topBots.length === 0 && (
                    <div className={styles.empty}>
                        ¯\_(ツ)_/¯ <br /> {t('errors.botsNotFound')}{' '}
                    </div>
                )}
                {newBots.length > 0 && (
                    <>
                        <h2 className={styles.bots_adadtext} >{t('newBots')}</h2>
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
    try {
        const topBots = await http.get(`/bots/top?limit=20`)
        const newBots = await http.get(`/bots/new?limit=4`)
        return { topBots: topBots.data, newBots: newBots.data }
    } catch (e) {
        return { topBots: [], newBots: [] }
    }
}

export default Home
