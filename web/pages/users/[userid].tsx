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
import http from '../../axios/http'
import FullscreenModal from '../../components/Modal/Modal'
interface Props {
    token?: string
    userid: string
}

const UserPage = ({ token, userid }: Props) => {
    const context = useContext(AuthContext)
    const [user, setUser] = useState<User>()
    const [show, setShow] = useState(false)
    const [inModal, setInModal] = useState("")
    
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

    const follow = async (id: string | undefined = user?.id) => {
        const { data } = await http.post(`/users/${id}/follow`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    config.AUTH_LOCAL_STORAGE_KEY
                )}`
            }
        })

        if (data === "OK" && id === user?.id) {
            const followers = [...(user?.followers || []), context.user]
            context.setUser({...context.user, following: [...context.user.following, user]})
            setUser({ ...user, followers } as any)
        } else {
            // following in global
        }
    }
    
    const unfollow = async (id: string | undefined = user?.id) => {
        const { data } = await http.post(`/users/${id}/unfollow`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    config.AUTH_LOCAL_STORAGE_KEY
                )}`
            }
        })
        if (data === "OK" && id === user?.id) {
            const followers = user?.followers.filter(follower => +follower.id !== +context.user.id)
            setUser({ ...user, followers } as any)
        } else {
            // following in global
        }
    }
    
    const modalTypeChange = (type: "followers" | "following") => {
        setInModal(type)
        setShow(true)
    }

    return (
        <Layout>
            <FullscreenModal title={inModal === "followers" ? "Подписчики" : "Подписки"} state={{ show, setShow }}>
                {inModal && (user as any)[inModal].map((user: User) => 
                <div key={user.id} className={styles["modal-user"]}>
                    <div>
                        <img src={user.avatar} />
                        <Link href={`/users/${user.id}`}><span>{user.username}#{user.discriminator}</span></Link>
                    </div>
                    {user.id !== context.user.id 
                    && !context.user.following.find(following => following.id === context.user.id) 
                    ? <button className={styles["modal-follow"]}>Подписаться</button>
                    : <button className={styles["modal-unfollow"]}>Отписаться</button>
                    }
                </div>
                )}
                {inModal && (user as any)[inModal].length === 0 && <div className={styles["modal-empty"]}>Список пуст.</div>}
            </FullscreenModal>
            <div className={styles.profile}>
                <div className={styles.avatar}>
                    <img src={user?.avatar} />
                    {user && user.id === context.user.id ? (
                        <Link href="/settings">Редактировать</Link>
                    ) : !!user?.followers.find(
                          follower => follower.id === context.user.id
                      ) ? (
                        <button onClick={() => unfollow()} className={styles.unfollow}>Отписаться</button>
                    ) : (
                        <button onClick={() => follow()} className={styles.follow}>Подписаться</button>
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
                                <Link key={link} href={link}>
                                    <img src={`/assets/logos/${key}.png`} />
                                </Link>
                            )
                        })}
                    </div>
                    <div className={styles["users-stats"]}>
                        <div className={styles.followers} onClick={() => modalTypeChange("followers")}>
                            {user?.followers.length} подписчиков
                        </div>
                        <div className={styles.following} onClick={() => modalTypeChange("following")}>
                            {user?.following.length} подписок
                        </div>
                    </div>
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
