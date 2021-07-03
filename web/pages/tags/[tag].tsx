import React from "react"
import Input from "../../components/Input/Input"
import { Dropdown, DropdownButton } from "react-bootstrap"
import Layout from "../../layout"
import styles from "../../styles/pages/tag.module.scss"
import Bot from "../../interfaces/bot.interface"
import Bots from "../../components/Bots/Bots"
import { NextPageContext } from "next"
import config from "../../config"

interface Props {
    bots: Bot[]
    tag: string
}

function TagPage({ tag, bots }: Props) {
    return (
        <Layout>
            <div className={styles.intro}>
                <div className={styles.title}>Лист ботов по тегу {tag}.</div>
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
            <Bots bots={bots} />
        </Layout>
    )
}

TagPage.getInitialProps = async ({ query }: NextPageContext) => {
    const res = await fetch(`${config.SERVER_URL}/tags/${query.tag}`)
    const data = await res.json()
    return { 
        tag: query.tag, 
        bots: data.bots
    }
}

export default TagPage
