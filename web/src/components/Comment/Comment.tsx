import Link from 'next/link'
import React from 'react'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import IComment from '../../interfaces/comment.interface'
import Stars from '../Stars/Stars'
import styles from './Comment.module.scss'
import api from '../../api'
import { useState } from 'react'

interface Props {
    comment: IComment
    isEdit?: boolean
    onCommentDelete?: (comment: IComment) => void
    onCommentUpdate?: (comment: IComment) => void
    setCommentEdit?: (comment: IComment | null) => void
    botId: string
}

const Comment: React.FC<Props> = ({
    comment,
    isEdit = false,
    onCommentDelete,
    onCommentUpdate,
    setCommentEdit,
    botId
}) => {
    const { user } = useContext(AuthContext)
    const isAuthor = user.id === comment.author.id
    const [commentary, setCommentary] = useState(comment)

    const edit = async () => {
        const data = await api.editComment(commentary, botId)
        if (!data) return
        onCommentUpdate?.(commentary)
        setCommentEdit?.(null)
    }

    const dislike = async () => {
        const data = await api.dislikeComment(comment, botId)
        if (!data || comment.dislikes.includes(user.id)) return
        onCommentUpdate?.({
            ...comment,
            dislikes: [...comment.dislikes, user.id]
        })
    }

    const like = async () => {
        const data = await api.likeComment(comment, botId)
        if (!data || comment.likes.includes(user.id)) return
        onCommentUpdate?.({ ...comment, likes: [...comment.likes, user.id] })
    }

    const del = async () => {
        const data = await api.deleteComment(comment, botId)
        if (data) onCommentDelete?.(comment)
    }

    return (
        <div className={styles.comment}>
            <img
                className={styles['comment-avatar']}
                src={comment.author.avatar}
            />
            <div className={styles['comment-body']}>
                <div className={styles['comment-header']}>
                    <div className={styles['comment-username']}>
                        <Link href={`/users/${comment.author.id}`}>
                            <div>
                                {comment.author.username}{' '}
                            </div>
                        </Link>
                    </div>
                    {isAuthor && (
                        <div className={styles['comment-controls']}>
                            {isEdit ? (
                                <img
                                    src="/assets/tick.svg"
                                    className={styles['comment-tick']}
                                    onClick={edit}
                                />
                            ) : (
                                <img
                                    src="/assets/edit.svg"
                                    onClick={() => setCommentEdit?.(comment)}
                                    className={styles['comment-edit']}
                                />
                            )}
                            <img
                                src="/assets/bin.svg"
                                onClick={del}
                                className={styles['comment-delete']}
                            />
                        </div>
                    )}
                </div>
                <div className={styles.stars}>
                    <Stars max={5} count={comment.rating} />
                </div>
                <div className={styles['comment-text']}>
                    {isEdit ? (
                        <textarea
                            onChange={e =>
                                setCommentary({
                                    ...comment,
                                    text: e.target.value
                                })
                            }
                            value={commentary.text}
                        />
                    ) : (
                        comment.text
                    )}
                </div>
                {!isEdit && (
                    <div className={styles['comment-rating']}>
                        <div
                            className={
                                comment.likes.includes(user.id)
                                    ? styles.active
                                    : ''
                            }
                            onClick={like}
                        >
                            <img src="/assets/like.svg" />
                            <div>{comment.likes.length}</div>
                        </div>
                        <div
                            className={
                                comment.dislikes.includes(user.id)
                                    ? styles.active
                                    : ''
                            }
                            onClick={dislike}
                        >
                            <img src="/assets/dislike.svg" />
                            <div>{comment.dislikes.length}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Comment
