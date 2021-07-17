import { NextPageContext } from 'next'
import config from '../../config'
import Bot from '../../interfaces/bot.interface'
import Layout from '../../layout'
import styles from '../../../styles/pages/bot.module.scss'
import Link from 'next/link'
import Markdown from '../../components/Markdown/Markdown'
import { Container } from 'react-bootstrap'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import { useState } from 'react'
import http from '../../api/http'
import IComment from '../../interfaces/comment.interface'
import Stars from '../../components/Stars/Stars'
import Comment from "../../components/Comment/Comment"

interface Props {
    bot: Bot
}

function BotPage(props: Props) {
    const { user } = useContext(AuthContext)
    const [comment, setComment] = useState('')
    const [bot, setBot] = useState<Bot>(props.bot)
    const [stars, setStars] = useState(0)
    const [limitedComments, setLimitedComments] = useState<null | string>(null)
    const [editableComment, setEditableComment] = useState<IComment | null>(null)

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


    const rating = Math.round(
        bot.comments
            .map(comment => comment.rating)
            .reduce((v, c) => (v += c), 0) / bot.comments.length
    )

    const vote = async () => {
        const { data } = await http.post(
            `/bots/${bot.id}/vote`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        config.AUTH_LOCAL_STORAGE_KEY
                    )}`
                }
            }
        )
        if (data === true)
            setBot({ ...bot, votes: [...bot.votes, user.id] as any })
    }

    const unvote = async () => {
        const { data } = await http.post(
            `/bots/${bot.id}/unvote`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        config.AUTH_LOCAL_STORAGE_KEY
                    )}`
                }
            }
        )
        if (data === true)
            setBot({
                ...bot,
                votes: bot.votes.filter(vote => (vote as any) !== user.id)
            })
    }

    const onCommentUpdate = (comment: IComment) => {
        const comments = bot.comments.map(c => c.id === comment.id ? comment : c)
        setBot({ ...bot, comments })
    }

    const onCommentDelete = (comment: IComment) => {
        const comments = bot.comments.filter(c => c.id !== comment.id)
        setBot({ ...bot, comments })
    }
    return (
        <Layout>
            <Container>
                <div className={styles.info}>
                    <div className={styles['avatar-container']}>
                        <img className={styles.avatar} src={bot.avatar} />
                    </div>
                    <div className={styles.passport}>
                        <div className={styles.header}>
                            <div className={styles.name}>{bot.name}</div>
                            <div
                                className={
                                    !bot.votes.includes(user.id as any)
                                        ? styles.votes
                                        : styles['votes-active']
                                }
                                onClick={
                                    !bot.votes.includes(user.id as any)
                                        ? vote
                                        : unvote
                                }
                            >
                                {bot.votes.length}
                                <img
                                    src={
                                        !bot.votes.includes(user.id as any)
                                            ? '/assets/vote.svg'
                                            : '/assets/vote-active.svg'
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles['header-stars']}>
                            <Stars count={rating} />
                            <div>based on {bot.comments.length} reviews</div>
                        </div>
                        <div className={styles.tags}>
                            {bot.tags.map(({ name }) => (
                                <Link href={`/tags/${name}`}>
                                    {name.slice(0, 1).toUpperCase() +
                                        name.slice(1).toLowerCase()}
                                </Link>
                            ))}
                        </div>
                        <div className={styles.links}>
                            {bot.inviteURL && (
                                <Link href={bot.inviteURL}>
                                    <img src="/assets/add-bot.svg" />
                                </Link>
                            )}
                            {bot.supportServerURL && (
                                <Link href={bot.supportServerURL}>
                                    <img src="/assets/discord-logo.svg" />
                                </Link>
                            )}
                            {bot.githubURL && (
                                <Link href={bot.githubURL}>
                                    <img src="/assets/github-logo.svg" />
                                </Link>
                            )}
                            {bot.websiteURL && (
                                <Link href={bot.websiteURL}>
                                    <img src="/assets/link.svg" />
                                </Link>
                            )}
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
                                    <Stars
                                        count={stars}
                                        max={5}
                                        onClick={setStars}
                                    />
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
                    {bot.comments.map(comment => 
                        <Comment 
                            comment={comment} 
                            onCommentUpdate={onCommentUpdate} 
                            isEdit={comment.id === editableComment?.id} 
                            setCommentEdit={setEditableComment}
                            onCommentDelete={onCommentDelete}
                        />    
                    )}
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