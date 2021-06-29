import { FC } from 'react'
import Bot from '../../interfaces/bot.interface'
import styles from './Bots.module.scss'
import BotCard from '../BotCard/BotCard'

interface Props {
    bots: Bot[]
}

const Bots: FC<Props> = ({ bots }) =>
    bots.length ? (
        <div className={styles.bots}>
            {bots.map(bot => (
                <BotCard key={bot.id} bot={bot} />
            ))}
        </div>
    ) : (
        <div className={styles.empty}>Ничего не было найдено!</div>
    )

export default Bots
