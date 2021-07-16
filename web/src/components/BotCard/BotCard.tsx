import { FC } from 'react'
import Bot from '../../interfaces/bot.interface'
import styles from './BotCard.module.css'
import Link from 'next/link'

interface Props {
    bot: Bot
}

const BotCard: FC<Props> = ({ bot }) => (
    <div className={styles.card}>
        <div
            className={styles.background}
            style={{
                backgroundImage: bot.backgroundURL
                    ? `url('${bot.backgroundURL}')`
                    : `url(/assets/default-bot-background.svg)`
            }}
        />
        <div className={styles.info}>
            <img className={styles.avatar} src={bot.avatar} />
            <div className={styles.passport}>
                <div className={styles.botname}>
                    {bot.name.length <= 12
                        ? bot.name
                        : bot.name.slice(0, 13) + '...'}
                </div>
                <div className={styles.statistics}>
                    <div className={styles.stat}>
                        <img src="/assets/upvote.svg" />
                        <div>{bot.votes.length}</div>
                    </div>
                    <div className={styles.stat}>
                        <img src="/assets/comment.svg" />
                        <div>{bot.comments.length}</div>
                    </div>
                    <div className={styles.stat}>
                        <img src="/assets/server.svg" />
                        <div>{bot.guildsCount}</div>
                    </div>
                </div>
            </div>
        </div>
        <div className={styles.description}>{bot.shortDescription}</div>
        <div className={styles.buttons}>
            <div className={styles.invite}>
                <a href={bot.inviteURL || ''}>Пригласить</a>
            </div>
            <div className={styles.view}>
                <Link href={`/bots/${bot.id}`}>Просмотреть</Link>
            </div>
        </div>
    </div>
)

export default BotCard
