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
import { Row, Col, Image, Spinner } from 'react-bootstrap'
import { useMediaQuery } from 'react-responsive'
import router from 'next/router'
interface Props {
    token?: string
    userid: string
}

const UserPage = ({ token, userid }: Props) => {
    const context = useContext(AuthContext)
    const [user, setUser] = useState<User>()
    const [show, setShow] = useState(false)
    const [inModal, setInModal] = useState('')
    const isMobile = useMediaQuery({ query: '(max-width: 630px)' })
    const [loading, setLoading] = useState(false)

    const getUser = async () => {
        try {
            const data = await api.getUser(userid, token)
            if (data.statusCode === 401 && userid === 'me')
                return router.push('/')
            if (userid === 'me') context.setUser(data)
            setUser(data)
        } catch (e) {
            console.log(`Error: `, e)
            return router.push('/')
        }
    }
    useEffect(() => {
        setLoading(true)
        getUser()
        setShow(false)
        setLoading(false)
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
        if (!data) return
        if (user) setUser({ ...user, banned: true } as any)
    }

    const unban = async () => {
        const data = await api.unbanUser(user?.id as string)
        if (!data) return
        if (user) setUser({ ...user, banned: false } as any)
    }

    if (loading) return <Spinner animation="border" variant="primary" />

    return (
        <Layout>
            <FullscreenModal
                title={inModal === 'followers' ? 'Подписчики' : 'Подписки'}
                state={{ show, setShow }}
            >
                {inModal && (user as any)[inModal].length !== 0 ? (
                    (user as any)[inModal].map((user: User) => (
                        <UserCard
                            follow={follow}
                            unfollow={unfollow}
                            user={user}
                        />
                    ))
                ) : (
                    <div className={styles['modal-empty']}>Список пуст.</div>
                )}
            </FullscreenModal>
            <Row className={styles.profile}>
                <Col sm={1.5} className={styles.left}>
                    <Image src={user?.avatar} className={styles.avatar} />
                    {context.user.id && user?.id === context.user.id && (
                        <Link href="/settings">Редактировать</Link>
                    )}
                    {context.user.id && context.user.id !== user?.id ? (
                        !context.user.following.find(f => f.id === user?.id) ? (
                            <button
                                className={styles.green}
                                onClick={() => follow()}
                            >
                                Подписаться
                            </button>
                        ) : (
                            <button
                                className={styles.red}
                                onClick={() => unfollow()}
                            >
                                Отписаться
                            </button>
                        )
                    ) : null}
                    {context.user.id &&
                    context.user.id !== user?.id &&
                    context.user.role === 'admin' &&
                    context.user.role !== user?.role ? (
                        user?.banned ? (
                            <button onClick={unban} className={styles.green}>
                                Разбанить
                            </button>
                        ) : (
                            <button onClick={ban} className={styles.red}>
                                Забанить
                            </button>
                        )
                    ) : null}
                </Col>
                <Col className={styles.right}>
                    <div className={styles.username}>
                        {user?.verified && (
                            <img
                                src="/assets/verified.png"
                                className="verified"
                            />
                        )}
                        <div className={styles.name}>
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
                    <div className={styles.stats}>
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
                </Col>
            </Row>
            {user?.bots && user.bots.length > 0 ? (
                <Bots
                    bots={user.bots}
                    position={isMobile ? 'center' : 'left'}
                />
            ) : (
                <div className={styles.bots}>У пользователя нету ботов</div>
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
