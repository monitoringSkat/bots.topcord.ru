import Link from 'next/link'
import config from '../../config'
import Tag from '../../interfaces/tag.interface'
import Layout from '../../layout'
import styles from '../../../styles/pages/tags.module.scss'
import { useTranslation } from 'react-i18next'
interface Props {
    tags: {
        tag: string
        count: number
    }[]
}

function TagsPage({ tags }: Props) {
    const { t } = useTranslation()
    return (
        <Layout title="Список тегов | TopCord">
            <div className={styles.container}>
                <h1>{t('tags.available')}</h1>
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
    try {
        const res = await fetch(`${config.SERVER_URL}/tags`)
        const tags = await res.json()
        return { tags }
    } catch (e) {
        return { tags: [] }
    }
}

export default TagsPage
