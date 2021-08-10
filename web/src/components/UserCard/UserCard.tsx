import Link from 'next/link'
import React from 'react'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import User from '../../interfaces/user.interface'
import styles from './UserCard.module.scss'
import { Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

interface Props {
    user: User
    follow: (user: User) => void
    unfollow: (user: User) => void
}

const UserCard: React.FC<Props> = ({ user, follow, unfollow }) => {
    const context = useContext(AuthContext)
    const {t} = useTranslation()
    return (
        <Col>
            <div className={styles['user']}>
                <div>
                    <img src={user.avatar} />
                    <Link href={`/users/${user.id}`}>
                        <span>
                            {user.username}#{user.discriminator}
                        </span>
                    </Link>
                </div>
                {user.id !== context.user.id && context.user.id ? (
                    !context.user.following.find(
                        following => following.id === user.id
                    ) ? (
                        <button
                            onClick={() => follow(user)}
                            className={styles['follow']}
                        >
                            {t("buttons.follow")}
                        </button>
                    ) : (
                        <button
                            onClick={() => unfollow(user)}
                            className={styles['unfollow']}
                        >
                            {t("buttons.unfollow")}
                        </button>
                    )
                ) : null}
            </div>
        </Col>
    )
}

export default UserCard
