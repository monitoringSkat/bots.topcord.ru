import { FC, useEffect, useState } from 'react'
import styles from '../../styles/layout/settings-layout.module.scss'
import Link from 'next/link'
import { useContext } from 'react'
import AuthContext from '../context/auth.context'
import { Col, Row, Container } from 'react-bootstrap'
import { detect } from 'detect-browser'

const SettingsLayout: FC = ({ children }) => {
    const [[browser, system], setNavigator] = useState<any[]>([null, null])
    const { logout } = useContext(AuthContext)
    useEffect(() => {
        const browser = detect()
        if (browser) setNavigator([browser?.name, browser?.os])
    }, [browser, system])
    return (
        <Row style={{ overflow: 'auto' }}>
            <Link href="/">
                <div className={styles.home}>
                    <img src="/assets/home.svg" />
                </div>
            </Link>
            <Col className={styles.menu} md="3">
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
            <Col>
                <div className={styles.content}>{children}</div>
            </Col>
        </Row>
    )
}

export default SettingsLayout
