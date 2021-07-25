import { FC, useState, Component } from 'react'
import Bot from '../../interfaces/bot.interface'
import styles from './Bots.module.scss'
import BotCard from '../BotCard/BotCard'
import { Col, Container, Row } from 'react-bootstrap'

interface Props {
    bots: Bot[]
    perPage?: number
}

const Bots: FC<Props> = ({ bots, perPage = 10 }) => {
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
                ¯\_(ツ)_/¯ <br /> Боты не найдены.{' '}
            </div>
        )
    return (
        <>
            <Row>
                {bots.slice(page * perPage, perPage * (page + 1)).map(bot => (
                    <Col>
                        <BotCard key={bot.id} bot={bot} />
                    </Col>
                ))}
            </Row>
            {navigation.length > 1 && (
                <div className={styles.navigation}>{navigation}</div>
            )}
        </>
    )
}

export default Bots
