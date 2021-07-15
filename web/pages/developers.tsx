import Link from 'next/link'
import Layout from '../layout'
import styles from '../styles/pages/developers.module.scss'
import developers from './developers.json'
import { Col, Container, Row, Card } from 'react-bootstrap'

const DevelopersPage = () => (
    <Layout title="Developers">
        <h1 className={styles.title}>Команда сайта</h1>
        <div className={styles.cards}>
            {developers.map(developer => (
                <div className={styles.card}>
                    <img className={styles.avatar} src={developer.avatar} />
                    <div className={styles.info}>
                        <div className={styles.name}>
                            <div>{developer.username}</div>{' '}
                            <span>{developer.role}</span>
                        </div>
                        <div className={styles.links}>
                            {Object.keys(developer.social).map(key => {
                                return (
                                    <Link href={(developer.social as any)[key]}>
                                        <img src={`/assets/logos/${key}.png`} />
                                    </Link>
                                )
                            })}
                        </div>
                        <div className={styles.bio}>{developer.bio}</div>
                    </div>
                </div>
            ))}
        </div>
    </Layout>
)

export default DevelopersPage
