import { NextPageContext } from 'next'
import config from '../../config'
import Bot from '../../interfaces/bot.interface'
import Layout from '../../layout'
import styles from '../../styles/pages/bot.module.scss'
import Link from 'next/link'
import Markdown from '../../components/Markdown/Markdown'
import { Container } from 'react-bootstrap'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import { useState } from 'react'
import http from '../../axios/http'
import Comment from '../../interfaces/comment.interface'
interface Props {
    bot: Bot
}

function BotPage(props: Props) {
    const { user } = useContext(AuthContext)
    const [comment, setComment] = useState('')
    const [bot, setBot] = useState(props.bot)
    const [stars, setStars] = useState(0)
    const [limitedComments, setLimitedComments] = useState<null | string>(null)
    const [editableComment, setEditableComment] = useState<Comment | null>(null)

    const createComment = async () => {
        try {
            const { data } = await http.post(
                `/bots/${bot.id}/comment`,
                { text: comment, rating: stars },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            config.AUTH_LOCAL_STORAGE_KEY
                        )}`
                    }
                }
            )
            if (data.statusCode === 503)
                return setLimitedComments('Вы превысили лимит комментариев!')
            setBot({ ...bot, comments: [data, ...bot.comments] })
            setComment('')
            setStars(0)
        } catch (e) {
            console.log(e)
        }
    }

    const editComment = async () => {
        const { data } = await http.put(
            `/bots/${bot.id}/comment`,
            editableComment,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        config.AUTH_LOCAL_STORAGE_KEY
                    )}`
                }
            }
        )
        if (data !== 'OK') return
        const comments = bot.comments.map(c => {
            if (c.id === editableComment?.id) {
                c.text = editableComment.text
            }
            return c
        })
        setBot({ ...bot, comments })
        setEditableComment(null)
    }

    const deleteComment = async (id: string | number) => {
        const { data } = await http.delete(`/bots/${bot.id}/comment/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    config.AUTH_LOCAL_STORAGE_KEY
                )}`
            }
        })
        if (data !== 'OK') return
        const comments = bot.comments.filter(comment => comment.id !== id)
        setBot({ ...bot, comments })
    }

    return (
        <Layout>
            <Container>
                <div className={styles.info}>
                    <img className={styles.avatar} src={bot.avatar} />
                    <div>
                        <div className={styles.name}>{bot.name}</div>
                        <div className={styles.tags}>
                            {bot.tags.map(({ name }) => (
                                <Link href={`/tags/${name}`}>
                                    {name.slice(0, 1).toUpperCase() +
                                        name.slice(1).toLowerCase()}
                                </Link>
                            ))}
                        </div>
                        <div className={styles.links}>
                            <Link href={bot.inviteURL || ''}>
                                <img src="/assets/add-bot.svg" />
                            </Link>
                            <Link href={bot.supportServerURL || ''}>
                                <img src="/assets/discord-logo.svg" />
                            </Link>
                            <Link href={bot.githubURL || ''}>
                                <img src="/assets/github-logo.svg" />
                            </Link>
                            <Link href={bot.websiteURL || ''}>
                                <img src="/assets/link.svg" />
                            </Link>
                        </div>
                        <div className={styles.additional}>
                            <div>
                                Префикс: <span>{bot.prefix}</span>
                            </div>
                            <div>
                                Библиотека: <span>{bot.library}</span>
                            </div>
                            <div className={styles.developers}>
                                Разработчики:
                                {bot.developers.map(developer => (
                                    <Link
                                        key={developer.id}
                                        href={`/users/${developer.id}`}
                                    >
                                        <img src={developer.avatar} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <Markdown
                    className={styles.description}
                    text={bot.longDescription}
                />
                <div className={styles.comments}>
                    <h3>Комментарии</h3>
                    {user.id && (
                        <div className={styles['write-comment']}>
                            {limitedComments !== null && (
                                <div className={styles.error}>
                                    {limitedComments}
                                </div>
                            )}
                            <div className={styles.write}>
                                <img src={user.avatar} />
                                <textarea
                                    value={comment}
                                    placeholder="Написать комментарий"
                                    onChange={e => setComment(e.target.value)}
                                />
                            </div>
                            <div className={styles.rating}>
                                <div className={styles.stars}>
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const src =
                                            i < stars
                                                ? '/assets/star-active.svg'
                                                : '/assets/star.svg'
                                        return (
                                            <img
                                                onClick={() => setStars(i + 1)}
                                                src={src}
                                            />
                                        )
                                    })}
                                </div>
                                <button
                                    disabled={
                                        comment.length === 0 || stars === 0
                                    }
                                    className={styles.post}
                                    onClick={createComment}
                                >
                                    Опубликовать
                                </button>
                            </div>
                        </div>
                    )}
                    {bot.comments.map(c => (
                        <div key={c.id} className={styles.comment}>
                            <img
                                className={styles['comment-avatar']}
                                src={c.author.avatar}
                            />
                            <div className={styles['comment-body']}>
                                <div className={styles['comment-header']}>
                                    <div className={styles['comment-username']}>
                                        <Link href={`/users/${c.author.id}`}>
                                            <div>
                                                {c.author.username}{' '}
                                                <span className={styles['']}>
                                                    {c.author.role}
                                                </span>
                                            </div>
                                        </Link>
                                    </div>

                                    {user.id === c.author.id && (
                                        <div
                                            className={
                                                styles['comment-controls']
                                            }
                                        >
                                            {editableComment?.id === c.id ? (
                                                <img
                                                    src="/assets/tick.svg"
                                                    className={
                                                        styles['comment-tick']
                                                    }
                                                    onClick={editComment}
                                                />
                                            ) : (
                                                <img
                                                    src="/assets/edit.svg"
                                                    onClick={() =>
                                                        setEditableComment(c)
                                                    }
                                                    className={
                                                        styles['comment-edit']
                                                    }
                                                />
                                            )}
                                            <img
                                                src="/assets/bin.svg"
                                                onClick={() =>
                                                    deleteComment(c.id)
                                                }
                                                className={
                                                    styles['comment-delete']
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.stars}>
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const src =
                                            i < c.rating
                                                ? '/assets/star-active.svg'
                                                : '/assets/star.svg'
                                        return <img src={src} />
                                    })}
                                </div>
                                <div className={styles['comment-text']}>
                                    {editableComment?.id === c.id ? (
                                        <textarea
                                            onChange={e =>
                                                setEditableComment({
                                                    ...editableComment,
                                                    text: e.target.value
                                                })
                                            }
                                            value={editableComment?.text}
                                        />
                                    ) : (
                                        c.text
                                    )}
                                </div>
                                {editableComment?.id !== c.id && (
                                    <div className={styles['comment-rating']}>
                                        <div>
                                            <img src="/assets/like.svg" />
                                            <div>15</div>
                                        </div>
                                        <div>
                                            <img src="/assets/dislike.svg" />
                                            <div>15</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </Layout>
    )
}

BotPage.getInitialProps = async ({ query }: NextPageContext) => {
    const { botid } = query
    const res = await fetch(`${config.SERVER_URL}/bots/${botid}`)
    const bot = await res.json()
    return { bot }
}

export default BotPage
