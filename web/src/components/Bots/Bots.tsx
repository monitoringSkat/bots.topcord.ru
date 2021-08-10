import { FC, useState } from 'react'
import Bot from '../../interfaces/bot.interface'
import styles from './Bots.module.scss'
import BotCard from '../BotCard/BotCard'
import { useTranslation } from 'react-i18next'

interface Props {
    bots: Bot[]
    perPage?: number
    position?: 'center' | 'left' | 'right'
}

const Bots: FC<Props> = ({ bots, perPage = 10, position = 'center' }) => {
    const { t } = useTranslation()
    const [page, setPage] = useState(0)
    const navigation = []
    for (let i = 0; i < Math.ceil(bots.length / perPage); i++) {
        navigation.push(
            <div
                key={i}
                onClick={() => setPage(i)}
                className={page === i ? styles.active : ''}
            >
                {i + 1}
            </div>
        )
    }
    if (!bots.length)
        return (
            <div className={styles.empty}>
                ¯\_(ツ)_/¯ <br /> {t("errors.botsNotFound")}{' '}
            </div>
        )
    return (
        <>
            <div className={styles.bots} style={{ justifyContent: position }}>
                {bots.slice(page * perPage, perPage * (page + 1)).map(bot => (
                    <BotCard key={bot.id} bot={bot} />
                ))}
            </div>
            {navigation.length > 1 && (
                <div className={styles.navigation}>{navigation}</div>
            )}
        </>
    )
}

export default Bots
