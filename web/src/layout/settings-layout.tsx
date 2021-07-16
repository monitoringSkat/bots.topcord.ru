import { FC, useEffect, useState } from 'react'
import styles from '../../styles/layout/settings-layout.module.scss'
import Link from 'next/link'
import { useContext } from 'react'
import AuthContext from '../context/auth.context'

const SettingsLayout: FC = ({ children }) => {
    const [[browser, system], setNavigator] = useState(['', ''])
    const { logout } = useContext(AuthContext)
    useEffect(() => {
        if (window && window.navigator) {
            setNavigator([
                window.navigator.appCodeName,
                (window.navigator as any).oscpu
            ])
        }
    }, [browser, system])
    return (
        <div className={styles.container}>
            <Link href="/">
                <div className={styles.home}>
                    <img src="/assets/home.svg" />
                </div>
            </Link>
            <div className={styles.menu}>
                <h1>Настройки</h1>
                <Link href="/settings/">Профиль пользователя</Link>
                <Link href="/settings/language">Язык</Link>
                <hr />
                <div className={styles.logout} onClick={logout}>
                    Выйти
                </div>
                <hr />
                <div className={styles.information}>
                    <div>Текущая версия: 1.0.0</div>
                    <div>Браузер: {browser}</div>
                    <div>Операционная система: {system}</div>
                </div>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    )
}

export default SettingsLayout
