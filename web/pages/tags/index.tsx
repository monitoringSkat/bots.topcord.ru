import Link from 'next/link'
import config from '../../config'
import Tag from '../../interfaces/tag.interface'
import Layout from '../../layout'
import styles from '../../styles/pages/tags.module.scss'
interface Props {
    tags: {
        tag: string
        count: number
    }[]
}

function TagsPage({ tags }: Props) {
    return (
        <Layout>
            <div className={styles.container}>
                <h1>Список тегов доступных на TopCord.</h1>
                <div className={styles.tags}>
                    {tags.map(tag => (
                        <Link href={`/tags/${tag.tag}`} key={tag.tag}>
                            <div className={styles.tag}>
                                <div className={styles.name}>{tag.tag}</div>
                                <div className={styles.count}>{tag.count}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

TagsPage.getInitialProps = async () => {
    const res = await fetch(`${config.SERVER_URL}/tags`)
    const tags = await res.json()
    return { tags }
}

export default TagsPage
