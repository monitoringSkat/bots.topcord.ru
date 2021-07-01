import { NextPageContext } from 'next'
import config from '../../config'
import Bot from '../../interfaces/bot.interface'
import Layout from '../../layout'

interface Props {
    bot: Bot
}

function BotPage({ bot }: Props) {
    return <Layout></Layout>
}

BotPage.getInitialProps = async ({ query }: NextPageContext) => {
    const { botid } = query
    const res = await fetch(`${config.SERVER_URL}/bots/${botid}`)
    const bot = await res.json()
    return { bot }
}

export default BotPage
