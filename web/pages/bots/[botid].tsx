import { NextPageContext } from 'next'
import config from '../../config'
import Bot from '../../interfaces/bot.interface'
import Layout from '../../layout'
import styles from '../../styles/pages/bot.module.scss'
import Link from 'next/link'
import Markdown from '../../components/Markdown/Markdown'
import { Container } from 'react-bootstrap'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import { useState } from 'react'

interface Props {
    bot: Bot
}

function BotPage(props: Props) {
    const { user } = useContext(AuthContext)
    const [ comment, setComment ] = useState("")
    const [ bot, setBot ] = useState(props.bot)
    const [stars, setStars] = useState(0)   

    return (
        <Layout>
            <Container>
                <div className={styles.info}>
                    <img className={styles.avatar} src={bot.avatar} />
                    <div>
                        <div className={styles.name}>{bot.name}</div>
                        <div className={styles.tags}>
                            {bot.tags.map(({ name }) => (
                                <Link href={`/tags/${name}`}>
                                    {name.slice(0, 1).toUpperCase() +
                                        name.slice(1).toLowerCase()}
                                </Link>
                            ))}
                        </div>
                        <div className={styles.links}>
                            <Link href={bot.inviteURL || ''}>
                                <img src="/assets/add-bot.svg" />
                            </Link>
                            <Link href={bot.supportServerURL || ''}>
                                <img src="/assets/discord-logo.svg" />
                            </Link>
                            <Link href={bot.githubURL || ''}>
                                <img src="/assets/github-logo.svg" />
                            </Link>
                            <Link href={bot.websiteURL || ''}>
                                <img src="/assets/link.svg" />
                            </Link>
                        </div>
                        <div className={styles.additional}>
                            <div>
                                Префикс: <span>{bot.prefix}</span>
                            </div>
                            <div>
                                Библиотека: <span>{bot.library}</span>
                            </div>
                            <div className={styles.developers}>
                                Разработчики:
                                {bot.developers.map(developer => 
                                    <Link key={developer.id} href={`/users/${developer.id}`}>
                                        <img
                                            src={developer.avatar}
                                        />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Markdown
                    className={styles.description}
                    text={bot.longDescription}
                />
                <div className={styles.comments}>
                    <h3>Комментарии</h3>
                    {user.id && 
                        <div className={styles["write-comment"]}>
                            <div className={styles.write}>
                                <img src={user.avatar} />
                                <textarea value={comment} placeholder="Написать комментарий" onChange={e => setComment(e.target.value)}/>
                            </div>
                            <div className={styles.rating}>
                                <div className={styles.stars}>
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const src = i < stars ? "/assets/star-active.svg" : "/assets/star.svg"
                                        return <img onClick={() => setStars(i + 1)} src={src} />
                                    }
                                    )}
                                </div>
                                <button disabled={!comment.length && !!stars} className={styles.post}>Опубликовать</button>
                            </div>
                        </div>

                    }
                    {bot.comments.map((c) => 
                        <div key={c.id} className={styles.comment}>
                            
                        </div>

                    )}
                </div>
            </Container>
        </Layout>
    )
}

BotPage.getInitialProps = async ({ query }: NextPageContext) => {
    const { botid } = query
    const res = await fetch(`${config.SERVER_URL}/bots/${botid}`)
    const bot = await res.json()
    return { bot }
}

export default BotPage
