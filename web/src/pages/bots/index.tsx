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
import { useTranslation } from 'react-i18next'
interface Props {
    bots: Bot[]
}

function BotsPage({ bots }: Props) {
    const [sortMethod, setSortMethod] = useState<string | null>(null)
    const [library, setLibrary] = useState<string | null>(null)
    const { t } = useTranslation()

    const sortMethods = [
        t('filters.votes'),
        t('filters.guilds'),
        t('filters.comments'),
        t('filters.updatedAt')
    ]

    const sortedBots = bots
        .sort((a, b) => {
            switch (sortMethod) {
                case t('filters.guilds'):
                    return b.guildsCount - a.guildsCount
                case t('filters.updatedAt'):
                    return (
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    )
                case t('filters.comments'):
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
        <Layout
            title={`${t('titles.bots')}`}
            description="Bots.topcord.ru - мониторинг ботов дискорд. Вы можете подобрать для своего сервера бота из нашего списка, найти его в поиске, либо по тегам. "
            image="/assets/favicon.png"
        >
            <Container className={styles.intro} fluid>
                <Row>
                    <Col>
                        <div className={styles.title}>{t('title')}</div>
                        <div className={styles.search}>
                            <SearchBotsInput
                                placeholder={t('inputs.searchBot')}
                            />
                        </div>
                        <div className={styles.options}>
                            <DropdownButton
                                onSelect={e => setSortMethod(e)}
                                id="dropdown-basic-button"
                                title={sortMethod || t('filters.sortBy')}
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
                                title={library || t('filters.library')}
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
                                {t('filters.reset')}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Bots bots={sortedBots} />
        </Layout>
    )
}

BotsPage.getInitialProps = async (): Promise<Props> => {
    try {
        const { data } = await http.get(`/bots/all`)
        return { bots: data }
    } catch(e) {
        return { bots: [] }
    }
}

export default BotsPage
