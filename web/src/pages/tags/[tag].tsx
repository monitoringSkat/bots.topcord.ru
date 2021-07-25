import React from 'react'
import Layout from '../../layout'
import styles from '../../../styles/pages/tag.module.scss'
import Bot from '../../interfaces/bot.interface'
import Bots from '../../components/Bots/Bots'
import { NextPageContext } from 'next'
import config from '../../config'
import Link from 'next/link'
import Container from 'react-bootstrap/Container'

interface Props {
    bots: Bot[]
    tag: string
}

function TagPage({ tag, bots }: Props) {
    return (
        <Layout>
            <div className={styles.intro}>
                <h1>Боты по тегу {tag}</h1>
                <Link href="/bots">Вернуться к списку ботов</Link>
            </div>
            <Container>
                <Bots bots={bots} />
            </Container>
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
