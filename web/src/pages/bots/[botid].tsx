import { NextPageContext } from 'next'
import Link from 'next/link'
import { useState, useContext } from 'react'
import { Container } from 'react-bootstrap'
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
import { useTranslation } from 'react-i18next'
import MButton from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Picker } from 'emoji-mart'
import { customEmojis } from '../../data/emojis'

interface Props {
    bot: Bot
}

function BotPage(props: Props) {
    const { t } = useTranslation()

    if (!props.bot)
        return (
            <Layout title={'Bot not found!'}>
                <div className="notfound">{t('errors.botNotFound')}</div>
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
    const [emojiPickerState, SetEmojiPicker] = useState(false)
    const [open, setOpen] = useState<boolean>(false)

    function triggerPicker(event: any) {
        event.preventDefault()
        SetEmojiPicker(!emojiPickerState)
    }

    const confirmOpen = () => {
        setOpen(true)
    }

    const confirmAccept = () => {
        setOpen(false)
        remove()
    }
    const confirmClose = () => {
        setOpen(false)
    }

    const createComment = async () => {
        const data = await api.createComment({
            text: comment,
            rating: stars,
            botId: bot.id
        })
        if (!data) return setLimitedComments(t('errors.commentLimit'))

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
            if (data === true) {
                setBot({ ...bot, votes: bot.votes + 1 })
            }
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

    const selectEmoji = (emoji: any) => {
        setComment(comment + (emoji.native ? emoji.native : emoji.colons))
    }

    return (
        <Layout
            title={`${bot.name} | TopCord`}
            description={bot.shortDescription}
            image={bot.avatar}
        >
            <div className={styles.info}>
                <div className={styles['avatar-container']}>
                    <img className={styles.avatar} src={bot.avatar} />
                    {user.id === bot.owner.id && (
                        <button
                            onClick={() => router.push(`/add?botId=${bot.id}`)}
                            className={styles.edit}
                        >
                            {t('buttons.edit')}
                        </button>
                    )}
                    {user.id === bot.owner.id ||
                    ['moderator', 'admin'].includes(user.role.toLowerCase()) ? (
                        <button onClick={confirmOpen} className={styles.delete}>
                            {t('buttons.delete')}
                        </button>
                    ) : null}

                    {user.id !== bot.owner.id && (
                        <button
                            onClick={() => setShowReportModal(true)}
                            className={styles.report}
                        >
                            {t('buttons.report')}
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
                        <div>
                            {t('botPage.basedOn').replace(
                                '{count}',
                                `${bot.comments.length}`
                            )}
                        </div>
                    </div>
                    <div className={styles.tags}>
                        {bot.tags.map(({ name }) => (
                            <Link href={`/tags/${name}`}>
                                {name.slice(0, 1).toUpperCase() +
                                    name.slice(1).toLowerCase()}
                            </Link>
                        ))}
                    </div>
                    <div className={styles.additional}>
                        <div>
                            {t('botPage.prefix')}: <span>{bot.prefix}</span>
                        </div>
                        <div>
                            {t('botPage.library')}: <span>{bot.library}</span>
                        </div>
                        <div className={styles.developers}>
                            {t('botPage.developers')}:
                            {bot.developers.map(developer => (
                                <Link
                                    key={developer.id}
                                    href={`/users/${developer.id}`}
                                >
                                    <img src={developer.avatar} />
                                </Link>
                            ))}
                        </div>
                        <div className={styles.links}>
                            {bot.inviteURL && (
                                <MButton
                                    href={bot.inviteURL}
                                    color="primary"
                                    startIcon={
                                        <img src="/assets/add-bot.svg" />
                                    }
                                    variant="contained"
                                >
                                    {t('buttons.addbot')}
                                </MButton>
                            )}
                            {bot.supportServerURL && (
                                <MButton
                                    href={bot.supportServerURL}
                                    color="primary"
                                    startIcon={
                                        <img src="/assets/discord-logo.svg" />
                                    }
                                    variant="contained"
                                >
                                    {t('buttons.support')}
                                </MButton>
                            )}
                            {bot.githubURL && (
                                <MButton
                                    href={bot.githubURL}
                                    color="primary"
                                    startIcon={
                                        <img src="/assets/github-logo.svg" />
                                    }
                                    variant="contained"
                                >
                                    {t('buttons.github')}
                                </MButton>
                            )}
                            {bot.websiteURL && (
                                <MButton
                                    href={bot.websiteURL}
                                    color="primary"
                                    startIcon={<img src="/assets/link.svg" />}
                                    variant="contained"
                                >
                                    {t('buttons.website')}
                                </MButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Container>
                <ReportModal
                    setShow={setShowReportModal}
                    bot={bot}
                    isShow={showReportModal}
                />

                <Dialog
                    open={open}
                    onClose={confirmClose}
                    aria-labelledby="alert-confirm-delete"
                    aria-describedby="alert-confirm-description"
                    className={styles.confirmdelete}
                >
                    <DialogTitle id="alert-dialog-title">
                        {'???? ?????????? ???????????? ?????????????? ?????????'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ?????? ?????????? ?????????????????? ???????????? ?? ??????????????????????, ??????????
                            ?????????????? ?????? ???????????? ???? ??????????????????????????, ??????????????????????,
                            ?????????????? ?? ??.?? ???? ?????????? ???????????? ?????? ???????????????
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <MButton onClick={confirmClose} color="primary">
                            ??????
                        </MButton>
                        <MButton
                            onClick={confirmAccept}
                            color="primary"
                            autoFocus
                        >
                            ????
                        </MButton>
                    </DialogActions>
                </Dialog>

                <Markdown
                    className={styles.description}
                    text={bot.longDescription}
                />
                <div className={styles.comments}>
                    <h3>{t('titles.comments')}</h3>
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
                                    placeholder="???????????????? ??????????????????????"
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
                                <MButton
                                    onClick={triggerPicker}
                                    style={{ marginRight: '2%' }}
                                >
                                    ????
                                </MButton>
                                <MButton
                                    className={
                                        comment.length > 130 ? styles.limit : ''
                                    }
                                    style={{ float: 'right' }}
                                >
                                    {comment.length} \ 130
                                </MButton>
                                <button
                                    disabled={
                                        comment.length === 0 ||
                                        stars === 0 ||
                                        comment.length > 130
                                    }
                                    className={styles.post}
                                    onClick={createComment}
                                >
                                    {t('buttons.public')}
                                </button>
                            </div>
                            {emojiPickerState && (
                                <Picker
                                    title="???????????????? ????????????"
                                    emoji="point_up"
                                    theme="dark"
                                    custom={customEmojis}
                                    style={{ position: 'absolute', right: '0' }}
                                    onSelect={selectEmoji}
                                    set="google"
                                />
                            )}
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
    } catch (e) {
        return { bot: null }
    }
}

export default BotPage
