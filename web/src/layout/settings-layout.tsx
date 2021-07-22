import { FC, useEffect, useState } from 'react'
import styles from '../../styles/layout/settings-layout.module.scss'
import Link from 'next/link'
import { useContext } from 'react'
import AuthContext from '../context/auth.context'
import { Col, Row, Container } from 'react-bootstrap'

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
            <Row style={{'overflow': 'auto'}} >
                <Link href="/">
                    <div className={styles.home}>
                        <img src="/assets/home.svg" />
                    </div>
                </Link>
                <Col className={styles.menu} md='3'>
                    <Container>
                    <h1>Настройки</h1>
                    <Link href="/settings/">Профиль пользователя</Link>
                    <Link href="/settings/language">Язык</Link>
                    <hr />
                    <div className={styles.logout} onClick={logout}>
                        Выйти
                    </div>
                    <hr />
                    <div className={styles.information}>
                        <div>Текущая версия: 1.0.0-beta</div>
                        <div>Браузер: {browser}</div>
                        <div>Операционная система: {system}</div>
                    </div>
                    </Container>
                </Col>
                <div className={styles.content}>{children}</div>
            </Row>
    )
}

export default SettingsLayout
