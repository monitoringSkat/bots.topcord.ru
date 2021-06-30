import config from "../../config"
import User from "../../interfaces/user.interface"
import Layout from "../../layout"
import styles from "../../styles/pages/user.module.scss"
import { NextPageContext } from "next"
interface Props {
    user: User
}

const UserPage = ({ user }: Props) => {
    return ( 
    <Layout>
        {user ? <div className={styles.profile}>
            <img src={user.avatar} className={styles.avatar} />
            <div className={styles.info}>
                <div className={styles.passport}>
                    {user.verified && <img src="" className={styles.verified} /> }
                    <div className={styles.username}>{user.username}#{user.discriminator}</div>
                </div>
                <div className={styles.intergrations}>

                </div>
            </div>
        </div> : <div>User not found</div>}
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
