import config from '../../config'
import User from '../../interfaces/user.interface'
import Layout from '../../layout'
import styles from '../../styles/pages/user.module.scss'
import { NextPageContext } from 'next'
import Link from 'next/link'
import Bots from '../../components/Bots/Bots'
import { useEffect } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
interface Props {
    token?: string
    userid: string
}

const UserPage = ({ token, userid }: Props) => {
    const context = useContext(AuthContext)
    const [user, setUser] = useState<User>()
    const getUser = async () => {
        if (token) localStorage.setItem(config.AUTH_LOCAL_STORAGE_KEY, token)
        const res = await fetch(`${config.SERVER_URL}/users/${userid}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    config.AUTH_LOCAL_STORAGE_KEY
                )}`
            }
        })
        const json = await res.json()
        if (json.statusCode === 404) return { user: null }
        setUser(json)
    }
    useEffect(() => {
        getUser()
    }, [token, userid])
    console.log(Object.keys(user?.social || {}))
    return (
        <Layout>
            <div className={styles.profile}>
                <div className={styles.avatar}>
                    <img src={user?.avatar} />
                    {user && user.id === context.user.id && (
                        <Link href="/settings">Редактировать</Link>
                    )}
                </div>
                <div className={styles.info}>
                    <div className={styles.passport}>
                        {user?.verified && (
                            <img
                                src="/assets/verified.png"
                                className={styles.verified}
                            />
                        )}
                        <div className={styles.username}>
                            {user?.username}#{user?.discriminator}
                        </div>
                        <div className={styles.role}>{user?.role}</div>
                    </div>
                    <div className={styles.integrations}>
                        {Object.keys(user?.social || {}).map(key => {
                            const link = (user?.social as any)[key]
                            if (!link.trim().length) return
                            return (
                                <Link href={link}>
                                    <img src={`/assets/logos/${key}.png`} />
                                </Link>
                            )
                        })}
                    </div>
                    <div className={styles.followers}>100 подписчиков</div>
                    <div className={styles.following}>9 подписок</div>
                    <div className={styles.bio}>{user?.bio}</div>
                </div>
            </div>
            {user?.bots && user.bots.length > 0 ? (
                <Bots bots={user.bots} />
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
