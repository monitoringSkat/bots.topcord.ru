import Layout from '../../layout'
import styles from '../../styles/pages/bots.module.scss'
import Input from '../../components/Input/Input'
import { Dropdown, DropdownButton } from 'react-bootstrap'

function BotsPage() {
    return (
        <Layout title="Боты">
            <div className={styles.intro}>
                <div className={styles.title}>Лист ботов в Дискорд.</div>
                <Input placeholder="Найти бота" type="search" />
                <div className={styles.options}>
                    <DropdownButton
                        id="dropdown-basic-button"
                        title="Сортировоть по"
                    >
                        <Dropdown.Item href="#/action-1">Голосам</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">
                            Количеству серверов
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-2">
                            По дате обновления
                        </Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton
                        id="dropdown-basic-button"
                        title="Библиотека"
                    >
                        <Dropdown.Item href="#/action-1">
                            discord.js
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-2">
                            discord.py
                        </Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>
        </Layout>
    )
}

export default BotsPage
