import Link from "next/link"
import Layout from "../layout"
import styles from "../styles/pages/developers.module.scss"
import developers from "./developers.json"

const DevelopersPage = () => 
    <Layout title="Developers">
        <h1 className={styles.title}>Команда сайта</h1>
        <div className={styles.cards}>
            {developers.map(developer => 
                <div className={styles.card}>
                    <img className={styles.avatar} src={developer.avatar} />
                    <div className={styles.info}>
                        <div className={styles.name}><div>{developer.username}</div> <span>{developer.role}</span></div>
                        <div className={styles.links}>
                            {developer.social.github && <Link href={developer.social.github}><img src="/assets/github-logo.svg" /></Link>}
                            {developer.social.website && <Link href={developer.social.website}><img src="/assets/link.svg" /></Link> }
                            {developer.social.gitlab && <Link href={developer.social.gitlab}><img src="/assets/gitlab.webp" /></Link>}
                            {developer.social.kaggle && <Link href={developer.social.kaggle}><img src="/assets/kaggle.webp" /></Link>}
                            {developer.social.linkedin && <Link href={developer.social.linkedin}><img src="/assets/linkedin.webp" /></Link>}
                            {developer.social.twitter && <Link href={developer.social.twitter}><img src="/assets/twitter.png" /></Link>}
                        </div>
                        <div className={styles.bio}>{developer.bio}</div>
                    </div>
                </div>
            )}
        </div>
    </Layout>


export default DevelopersPage