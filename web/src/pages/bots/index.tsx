import Layout from '../../layout'
import styles from '../../../styles/pages/bots.module.scss'
import {
    Dropdown,
    DropdownButton,
    Container,
    Row,
    Col,
    Button
} from 'react-bootstrap'
import Bot from '../../interfaces/bot.interface'
import Bots from '../../components/Bots/Bots'
import SearchBotsInput from '../../components/SearchBotsInput/SearchBotsInput'
import libraries from '../../data/libraries.json'
import { useState } from 'react'
import http from '../../api/http'
interface Props {
    bots: Bot[]
}

const sortMethods = [
    'Голосам',
    'Количеству серверов',
    'Количеству комментариев',
    'По дате обновления'
]

function BotsPage({ bots }: Props) {
    const [sortMethod, setSortMethod] = useState<string | null>(null)
    const [library, setLibrary] = useState<string | null>(null)

    const sortedBots = bots
        .sort((a, b) => {
            switch (sortMethod) {
                case 'Количеству серверов':
                    return b.guildsCount - a.guildsCount
                case 'По дате обновления':
                    return (
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    )
                case 'Количеству комментариев':
                    return b.comments.length - a.comments.length
                default:
                    return b.votes - a.votes
            }
        })
        .filter(bot => (library ? bot.library === library : true))

    const resetFilter = () => {
        setSortMethod(null)
        setLibrary(null)
    }

    return (
        <Layout title="Боты | TopCord">
            <Container className={styles.intro} fluid>
                <Row>
                    <Col>
                        <div className={styles.title}>
                            Лист ботов в Дискорд.
                        </div>
                        <SearchBotsInput placeholder="Найти бота" />
                        <div className={styles.options}>
                            <DropdownButton
                                onSelect={e => setSortMethod(e)}
                                id="dropdown-basic-button"
                                title={sortMethod || 'Сортировоть по'}
                            >
                                {sortMethods.map(method => (
                                    <Dropdown.Item
                                        onClick={e => e.preventDefault()}
                                        href={method}
                                    >
                                        {method}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                            <DropdownButton
                                id="dropdown-basic-button"
                                title={library || 'Библиотека'}
                                onSelect={e => setLibrary(e)}
                            >
                                {libraries.map((lib: string) => (
                                    <Dropdown.Item
                                        key={lib}
                                        onClick={e => e.preventDefault()}
                                        href={lib}
                                    >
                                        {lib}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                            <Button
                                variant="danger"
                                onClick={resetFilter}
                                disabled={
                                    !library?.length && !sortMethod?.length
                                }
                            >
                                Очистить фильтр
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Bots bots={sortedBots} />
            </Container>
        </Layout>
    )
}

BotsPage.getInitialProps = async (): Promise<Props> => {
    const { data } = await http.get(`/bots/all`)
    return { bots: data }
}

export default BotsPage
