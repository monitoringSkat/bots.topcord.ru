import styles from '../styles/pages/404.module.scss'
import Layout from '../layout'

const PageNotFound = () => (
    <Layout title="404 | Topcord">
        <div className={styles.box} >
            <h1 className={styles.text} >404</h1>
            <h3 className={styles.undertext} >Страница не найдена.</h3>
        </div>
    </Layout> 
     )

export default PageNotFound
