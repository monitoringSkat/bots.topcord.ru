import Link from 'next/link'
import React from 'react'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import Comment from '../../interfaces/comment.interface'
import Stars from '../Stars/Stars'
import styles from './Comment.module.scss'
import api from "../../api"
interface Props {
    comment: Comment
    isEdit?: boolean
    isAuthor?: boolean
}

const Comment: React.FC<Props> = ({
    comment,
    isEdit = false,
    isAuthor = false
}) => {
    const { user } = useContext(AuthContext)
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
                                <span className={styles['']}>
                                    {comment.author.role}
                                </span>
                            </div>
                        </Link>
                    </div>
                    {isAuthor && (
                        <div className={styles['comment-controls']}>
                            {isEdit ? (
                                <img
                                    src="/assets/tick.svg"
                                    className={styles['comment-tick']}
                                    onClick={editComment}
                                />
                            ) : (
                                <img
                                    src="/assets/edit.svg"
                                    onClick={() => setEditableComment(c)}
                                    className={styles['comment-edit']}
                                />
                            )}
                            <img
                                src="/assets/bin.svg"
                                onClick={() => deleteComment(c.id)}
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
                                setEditableComment({
                                    ...editableComment,
                                    text: e.target.value
                                })
                            }
                            value={editableComment?.text}
                        />
                    ) : (
                        comment.text
                    )}
                </div>
                {isEdit && (
                    <div className={styles['comment-rating']}>
                        <div
                            className={
                                comment.likes.includes(user.id)
                                    ? styles.active
                                    : ''
                            }
                            onClick={() => likeComment(c.id)}
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
                            onClick={() => dislikeComment(c.id)}
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
