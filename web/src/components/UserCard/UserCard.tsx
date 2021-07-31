import Link from 'next/link'
import React from 'react'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import User from '../../interfaces/user.interface'
import styles from './UserCard.module.scss'
import { Col, Container, Row } from 'react-bootstrap'

interface Props {
    user: User
    follow: (user: User) => void
    unfollow: (user: User) => void
}

const UserCard: React.FC<Props> = ({ user, follow, unfollow }) => {
    const context = useContext(AuthContext)
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
                            Подписаться
                        </button>
                    ) : (
                        <button
                            onClick={() => unfollow(user)}
                            className={styles['unfollow']}
                        >
                            Отписаться
                        </button>
                    )
                ) : null}
            </div>
        </Col>
    )
}

export default UserCard
