import User from '../../interfaces/user.interface'
import Layout from '../../layout'
import styles from '../../../styles/pages/user.module.scss'
import { NextPageContext } from 'next'
import Link from 'next/link'
import Bots from '../../components/Bots/Bots'
import { useEffect } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import FullscreenModal from '../../components/Modal/Modal'
import api from '../../api'
import UserCard from '../../components/UserCard/UserCard'
import { Container, Row, Col, Jumbotron } from 'react-bootstrap'

interface Props {
    token?: string
    userid: string
}

const UserPage = ({ token, userid }: Props) => {
    const context = useContext(AuthContext)
    const [user, setUser] = useState<User>()
    const [show, setShow] = useState(false)
    const [inModal, setInModal] = useState('')

    const getUser = async () => {
        const data = await api.getUser(userid, token)
        setUser(data)
    }
    useEffect(() => {
        getUser()
        setShow(false)
    }, [token, userid])

    const follow = async (u: User | undefined = user) => {
        const data = api.followUser(u?.id)
        if (!data) return
        context.setUser({
            ...context.user,
            following: [...context.user.following, u]
        })
    }

    const unfollow = async (u: User | undefined = user) => {
        const data = await api.unfollowUser(u?.id)
        if (!data) return
        context.setUser({
            ...context.user,
            following: context.user.following.filter(
                following => following.id !== u?.id
            )
        })
    }

    const modalTypeChange = (type: 'followers' | 'following') => {
        setInModal(type)
        setShow(true)
    }

    const ban = async () => {
        const data = await api.banUser(user?.id as string)
        console.log(data)
        if (!data) return
        if (user) setUser({ ...user, banned: true } as any)
    }

    const unban = async () => {
        const data = await api.unbanUser(user?.id as string)
        if (!data) return
        if (user) setUser({ ...user, banned: false } as any)
    }

    return (
        <Layout>
            <Row>
                <Col>
                    <FullscreenModal
                        title={
                            inModal === 'followers' ? 'Подписчики' : 'Подписки'
                        }
                        state={{ show, setShow }}
                    >
                        {inModal && (user as any)[inModal].length !== 0 ? (
                            (user as any)[inModal].map((user: User) => (
                                <Col>
                                    <UserCard
                                        follow={follow}
                                        unfollow={unfollow}
                                        user={user}
                                    />
                                </Col>
                            ))
                        ) : (
                            <div className={styles['modal-empty']}>
                                Список пуст.
                            </div>
                        )}
                    </FullscreenModal>
                </Col>
                <Jumbotron className={styles.profile}>
                    <Col>
                        <div className={styles.avatar}>
                            <img src={user?.avatar} />
                            {user?.id === context.user.id && (
                                <Link href="/settings">Редактировать</Link>
                            )}
                            {context.user.id !== user?.id &&
                                (context.user.following.find(
                                    following => following.id === user?.id
                                ) ? (
                                    <button
                                        onClick={() => unfollow()}
                                        className={styles.unfollow}
                                    >
                                        Отписаться
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => follow()}
                                        className={styles.follow}
                                    >
                                        Подписаться
                                    </button>
                                ))}
                            {user?.id === context.user.id ||
                            context.user.role !==
                                'admin' ? null : !user?.banned ? (
                                <button onClick={ban} className={styles.ban}>
                                    Забанить
                                </button>
                            ) : (
                                <button
                                    onClick={unban}
                                    className={styles.unban}
                                >
                                    Разбанить
                                </button>
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
                                            <img
                                                src={`/assets/logos/${key}.png`}
                                            />
                                        </Link>
                                    )
                                })}
                            </div>
                            <div className={styles['users-stats']}>
                                <div
                                    className={styles.followers}
                                    onClick={() => modalTypeChange('followers')}
                                >
                                    {user?.followers.length} подписчиков
                                </div>
                                <div
                                    className={styles.following}
                                    onClick={() => modalTypeChange('following')}
                                >
                                    {user?.following.length} подписок
                                </div>
                            </div>
                            <div className={styles.bio}>{user?.bio}</div>
                        </div>
                    </Col>
                </Jumbotron>
                {user?.bots && user.bots.length > 0 ? (
                    <Bots bots={user.bots} />
                ) : (
                    <div className={styles.bots}>У пользователя нету ботов</div>
                )}
            </Row>
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
