import Layout from "../layout"
import styles from "../styles/pages/home.module.css"
import Input from "../components/Input/Input"
import Link from "next/link"

const Home = () => 
<Layout title="Главная">
    <div className={styles.intro}>
        <div className={styles.text}>
            <div className={styles.title}>Лист ботов в Дискорд.</div>
            <div className={styles.subtitle}>Добавляйте ботов, голосуйте за них. Выбирайте ботов. И все это на TopCord.</div>
            <Input type="search" placeholder="Найти бота" />
            <div className={styles.tags}>
                <Link href="/tags/fun">Fun</Link>
                <Link href="/tags/moderation">Moderation</Link>
            </div>
        </div>
        <img src="/wumpus-jet.png" className={styles.wumpus}/>
    </div>
</Layout>


export default Home
 