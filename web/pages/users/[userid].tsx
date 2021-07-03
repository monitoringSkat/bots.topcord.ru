import config from '../../config'
import User from '../../interfaces/user.interface'
import Layout from '../../layout'
import styles from '../../styles/pages/user.module.scss'
import { NextPageContext } from 'next'
interface Props {
    user: User
}

const UserPage = ({ user }: Props) => {
    return (
        <Layout>
            <div className={styles.profile}>
                <div className={styles.avatar}>
                    <img src="https://pbs.twimg.com/media/Erjoda3XcAILDgH.png" />
                    <button>Редактировать</button>
                </div>
                <div className={styles.info}>
                    <div className={styles.passport}>
                        <img src="/assets/verified.png" className={styles.verified} />
                        <div className={styles.username}>-vitaliyirtlach#6564</div>
                        <div className={styles.role}>Admin</div>
                    </div>
                    <div className={styles.intergrations}></div>
                </div>
            </div>
        </Layout>
    )
}

// [ATTENTION]: 'return { notFound: true }' doen't work...

UserPage.getInitialProps = async (ctx: NextPageContext) => {
    const { userid } = ctx.query
    const res = await fetch(`${config.SERVER_URL}/users/${userid}`)
    const json = await res.json()
    if (json.statusCode === 404) return { user: null }
    return { user: json }
}

export default UserPage
