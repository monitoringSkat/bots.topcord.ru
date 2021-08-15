import React from 'react'
import Layout from '../../layout'
import styles from '../../../styles/pages/tag.module.scss'
import Bot from '../../interfaces/bot.interface'
import Bots from '../../components/Bots/Bots'
import { NextPageContext } from 'next'
import config from '../../config'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

interface Props {
    bots: Bot[]
    tag: string
}

function TagPage({ tag, bots }: Props) {
    const { t } = useTranslation()
    return (
        <Layout>
            <div className={styles.intro}>
                <h1>
                    {t('tags.bytag')} {tag}
                </h1>
                <Link href="/bots">{t('tags.back')}</Link>
            </div>
            <Bots position="left" bots={bots} />
        </Layout>
    )
}

TagPage.getInitialProps = async ({ query }: NextPageContext) => {
    try {
        const res = await fetch(`${config.SERVER_URL}/tags/${query.tag}`)
        const data = await res.json()
        return {
            tag: query.tag,
            bots: data.bots
        }
    } catch (e) {
        return {
            tag: query.tag,
            bots: []
        }
    }
}

export default TagPage
