import Link from 'next/link'
import { InputHTMLAttributes, useEffect, useState } from 'react'
import config from '../../config'
import Bot from '../../interfaces/bot.interface'
import styles from './SearchBotsInput.module.scss'
import { Spinner } from "react-bootstrap"

interface Props extends InputHTMLAttributes<any> {}

const SearchBotsInput = (props: Props) => {
    const [ query, setQuery ] = useState("")
    const [ bots, setBots ] = useState<Bot[]>([])
    const [ loading, setLoading ] = useState(false)

    const getBotByQuery = (query: string) => async () => {
        if (!query) return
        setLoading(true)
        const res = await fetch(`${config.SERVER_URL}/bots?q=${query}`)
        const bots = await res.json()
        setLoading(false)
        if (bots) {
            setBots(bots)
        }
        console.log(bots.length > 0 || loading)
    }
    useEffect(() => {
        const delayDebounceFn = setTimeout(getBotByQuery(query), 500)
    
        return () => clearTimeout(delayDebounceFn)
      }, [query])

    const changeHandler = async (e: any) => {
        setBots([])
        setQuery(e.target.value)
    }

    return (
        <div className={styles['search-container']}>
            <div className={styles.search}>
                <input {...props} value={query} onChange={changeHandler} type="text" />
                <div className={styles.icon}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="white"
                        viewBox="0 0 16 16"
                    >
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                </div>
            </div>
            <div className={styles.autocomplete}>
                {loading && 
                <div className={styles.spinner}>
                    <Spinner animation="border" variant="primary" />
                </div>}
                {bots.map(bot => 
                    <Link href={`/bots/${bot.id}`}>
                        <div className={styles.bot}>
                            <img src={bot.avatar} className={styles.avatar} />
                            <div className={styles.info}>
                                <div className={styles.name}>{bot.name}</div>
                                <div className={styles.description}>{bot.description.slice(0, 50)}</div>
                            </div>
                        </div>
                    </Link>    
                )}
            </div>
            
        </div>
    )
}

export default SearchBotsInput
