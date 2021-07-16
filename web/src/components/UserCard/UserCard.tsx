import Link from 'next/link'
import React from 'react'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import User from '../../interfaces/user.interface'
import styles from './UserCard.module.scss'

interface Props {
    user: User
}

const UserCard: React.FC<Props> = ({ user }) => {
    const context = useContext(AuthContext)
    return (
        <div className={styles['modal-user']}>
            <div>
                <img src={user.avatar} />
                <Link href={`/users/${user.id}`}>
                    <span>
                        {user.username}#{user.discriminator}
                    </span>
                </Link>
            </div>
            {user.id !== context.user.id ? (
                !context.user.following.find(
                    following => following.id === user.id
                ) ? (
                    <button
                        onClick={() => follow(user)}
                        className={styles['modal-follow']}
                    >
                        Подписаться
                    </button>
                ) : (
                    <button
                        onClick={() => unfollow(user)}
                        className={styles['modal-unfollow']}
                    >
                        Отписаться
                    </button>
                )
            ) : null}
        </div>
    )
}

export default UserCard
