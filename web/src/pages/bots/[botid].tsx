import { NextPageContext } from 'next'
import Link from 'next/link'
import { useState, useContext } from 'react'
import { Button, Container, Row, Col } from 'react-bootstrap'
import config from '../../config'
import Bot from '../../interfaces/bot.interface'
import Layout from '../../layout'
import styles from '../../../styles/pages/bot.module.scss'
import Markdown from '../../components/Markdown/Markdown'
import AuthContext from '../../context/auth.context'
import http from '../../api/http'
import IComment from '../../interfaces/comment.interface'
import Stars from '../../components/Stars/Stars'
import Comment from '../../components/Comment/Comment'
import api from '../../api'
import ReportModal from '../../components/ReportModal/ReportModal'
import router from 'next/router'

interface Props {
    bot: Bot
}

function BotPage(props: Props) {
    if (!props.bot) return (
        <Layout title={"Bot not found!"}>
            <div className="notfound">Bot not found!</div>
        </Layout>
    )

    const { user } = useContext(AuthContext)
    const [comment, setComment] = useState('')
    const [bot, setBot] = useState<Bot>(props.bot)
    const [stars, setStars] = useState(0)
    const [limitedComments, setLimitedComments] = useState<null | string>(null)
    const [editableComment, setEditableComment] = useState<IComment | null>(
        null
    )
    const [showReportModal, setShowReportModal] = useState<boolean>(false)

    const createComment = async () => {
        const data = await api.createComment({
            text: comment,
            rating: stars,
            botId: bot.id
        })
        if (!data) return setLimitedComments('Вы превысили лимит комментариев!')
        setBot({ ...bot, comments: [data, ...bot.comments] })
        setComment('')
        setStars(0)
    }

    const rating = Math.round(
        bot.comments
            .map(comment => comment.rating)
            .reduce((v, c) => (v += c), 0) / bot.comments.length
    )

    const vote = async () => {
        try {
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
            if (data === true) setBot({ ...bot, votes: bot.votes + 1 })
        } catch (e) {}
    }

    const onCommentUpdate = (comment: IComment) => {
        const comments = bot.comments.map(c =>
            c.id === comment.id ? comment : c
        )
        setBot({ ...bot, comments })
    }

    const onCommentDelete = (comment: IComment) => {
        const comments = bot.comments.filter(c => c.id !== comment.id)
        setBot({ ...bot, comments })
    }

    const remove = async () => {
        const data = await api.deleteBot(bot?.id)
        if (!data) return
        router.push('/users/me')
    }

    return (
        <Layout title={`${bot.name} | TopCord`} description={bot.shortDescription} image={bot.avatar} >
            <Container>
                <ReportModal
                    setShow={setShowReportModal}
                    bot={bot}
                    isShow={showReportModal}
                />
                <div className={styles.info}>
                    <div className={styles['avatar-container']}>
                        <img className={styles.avatar} src={bot.avatar} />
                        {user.id === bot.owner.id && (
                            <button
                                onClick={() =>
                                    router.push(`/add?botId=${bot.id}`)
                                }
                                className={styles.edit}
                            >
                                Редактировать
                            </button>
                        )}
                        {user.id === bot.owner.id ||
                        ['moderator', 'admin'].includes(
                            user.role.toLowerCase()
                        ) ? (
                            <button onClick={remove} className={styles.delete}>
                                Удалить
                            </button>
                        ) : null}

                        {user.id !== bot.owner.id && (
                            <button
                                onClick={() => setShowReportModal(true)}
                                className={styles.report}
                            >
                                Пожаловаться
                            </button>
                        )}
                    </div>
                    <div className={styles.passport}>
                        <div className={styles.header}>
                            <div className={styles.name}>{bot.name}</div>
                            <div className={styles.votes} onClick={vote}>
                                {bot.votes}
                                <img src={'/assets/vote.svg'} />
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
                    {bot.comments.map(comment => (
                        <Comment
                            comment={comment}
                            onCommentUpdate={onCommentUpdate}
                            isEdit={comment.id === editableComment?.id}
                            setCommentEdit={setEditableComment}
                            onCommentDelete={onCommentDelete}
                            botId={bot.id}
                        />
                    ))}
                </div>
            </Container>
        </Layout>
    )
}

BotPage.getInitialProps = async ({ query }: NextPageContext) => {
    try {
        const { data } = await http.get(`/bots/${query.botid}`)
        return { bot: data }
    } catch(e) {
        return { bot: null }
    }
}

export default BotPage
