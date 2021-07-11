import Layout from '../../layout'
import styles from '../../styles/pages/bots.module.scss'
import { Dropdown, DropdownButton, Container } from 'react-bootstrap'
import Bot from '../../interfaces/bot.interface'
import config from '../../config'
import Bots from '../../components/Bots/Bots'
import SearchBotsInput from '../../components/SearchBotsInput/SearchBotsInput'
import libraries from '../../data/libraries.json'
import { useState } from 'react'
interface Props {
    bots: Bot[]
}

function BotsPage({ bots }: Props) {
    const [sortBy, setSortBy] = useState({ library: null, method: 'votes' })
    return (
        <Layout title="Боты | TopCord">
            <Container className={styles.intro} fluid>
                <div className={styles.title}>Лист ботов в Дискорд.</div>
                <SearchBotsInput placeholder="Найти бота" />
                <div className={styles.options}>
                    <DropdownButton
                        onSelect={e => console.log(e)}
                        id="dropdown-basic-button"
                        title="Сортировоть по"
                    >
                        <Dropdown.Item href="#/action-1">Голосам</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">
                            Количеству серверов
                        </Dropdown.Item>
                        <Dropdown.Item>По дате обновления</Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton
                        id="dropdown-basic-button"
                        title="Библиотека"
                    >
                        {libraries.map((lib: string) => (
                            <Dropdown.Item key={lib} href={lib}>
                                {lib}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </div>
            </Container>
            <Bots bots={bots} />
        </Layout>
    )
}

BotsPage.getInitialProps = async (): Promise<Props> => {
    const res = await fetch(`${config.SERVER_URL}/bots?c=all`)
    const bots = await res.json()
    return { bots }
}

export default BotsPage
