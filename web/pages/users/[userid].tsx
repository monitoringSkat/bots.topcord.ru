import config from '../../config'
import User from '../../interfaces/user.interface'
import Layout from '../../layout'
import styles from '../../styles/pages/user.module.scss'
import { NextPageContext } from 'next'
import Link from 'next/link'
import Bots from '../../components/Bots/Bots'
import { useEffect } from 'react'
import { useState } from 'react'
interface Props {
    token?: string
    userid: string
}

const UserPage = ({ token, userid }: Props) => {
    const [ user, setUser ] = useState<User>()
    const getUser = async () => {
        if (token) localStorage.setItem(config.AUTH_LOCAL_STORAGE_KEY, token)
        const res = await fetch(`${config.SERVER_URL}/users/${userid}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(config.AUTH_LOCAL_STORAGE_KEY)}`
            }
        })
        const json = await res.json()
        if (json.statusCode === 404) return { user: null }
        setUser(json)
    }
    useEffect(() => {
        getUser()
    }, [token, userid])
    console.log(user)
    return (
        <Layout>
            <div className={styles.profile}>
                <div className={styles.avatar}>
                    <img src="https://pbs.twimg.com/media/Erjoda3XcAILDgH.png" />
                    <button>Редактировать</button>
                </div>
                <div className={styles.info}>
                    <div className={styles.passport}>
                        <img
                            src="/assets/verified.png"
                            className={styles.verified}
                        />
                        <div className={styles.username}>
                            -vitaliyirtlach#6564
                        </div>
                        <div className={styles.role}>Admin</div>
                    </div>
                    <div className={styles.integrations}>
                        <Link href="https://github.com/vitaliyirtlach">
                            <img src="/assets/github-logo.svg" />
                        </Link>
                        <Link href="fdfdssd">
                            <img src="/assets/spotify.png" />
                        </Link>
                        <Link href="fdfdssd">
                            <img
                                className={styles.twitter}
                                src="/assets/twitter.png"
                            />
                        </Link>
                        <Link href="fdfdssd">
                            <img src="/assets/facebook.png" />
                        </Link>
                        <Link href="fdfdssd">
                            <img src="/assets/reddit.png" />
                        </Link>
                        <Link href="fdfdssd">
                            <img
                                className={styles.steam}
                                src="/assets/steam.png"
                            />
                        </Link>
                        <Link href="fdfdssd">
                            <img src="/assets/youtube.png" />
                        </Link>
                    </div>
                    <div className={styles.followers}>100 подписчиков</div>
                    <div className={styles.following}>9 подписок</div>
                    <div className={styles.bio}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quas voluptas labore, error incidunt corporis, qui sunt
                        dolorem atque nesciunt quasi laboriosam id quisquam
                        excepturi consequuntur rerum est iste deleniti vero.
                        Sequi est laudantium, impedit doloremque quos corrupti
                        quia quas repudiandae enim tempora harum blanditiis
                        rerum adipisci reprehenderit quasi ea nihil doloribus
                        laboriosam ratione. Pariatur tempora ipsam, magnam eos
                        voluptates minus.
                    </div>
                </div>
            </div>
            {[].length > 0 ? (
                <Bots bots={[]} />
            ) : (
                <div className={styles.bots}>Лист ботов пользователя пуст!</div>
            )}
        </Layout>
    )
}

UserPage.getInitialProps = async (ctx: NextPageContext) => {
    const { userid, token } = ctx.query
    return {
        userid,
        token
    }
}

export default UserPage
