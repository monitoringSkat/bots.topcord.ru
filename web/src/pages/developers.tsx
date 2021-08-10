import Link from 'next/link'
import Layout from '../layout'
import styles from '../../styles/pages/developers.module.scss'
import developers from './developers.json'
import { Col, Container, Row, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const DevelopersPage = () => {
    const { t } = useTranslation()
    return (
        <Layout title="Разработчики | TopCord">
            <h1 className={styles.title}>{t("team")}</h1>
            <Container>
                <Row>
                    {developers.map(developer => (
                        <Col>
                            <Card className={styles.card}>
                                <img
                                    className={styles.avatar}
                                    src={developer.avatar}
                                />
                                <div className={styles.info}>
                                    <div className={styles.name}>
                                        <div>{developer.username}</div>{' '}
                                        <span>{developer.role}</span>
                                    </div>
                                    <div className={styles.links}>
                                        {Object.keys(developer.social).map(key => {
                                            return (
                                                <Link
                                                    href={
                                                        (developer.social as any)[
                                                            key
                                                        ]
                                                    }
                                                >
                                                    <img
                                                        src={`/assets/logos/${key}.png`}
                                                    />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className={styles.bio}>
                                        {developer.bio}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Layout>
    )
}

export default DevelopersPage
