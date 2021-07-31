import React, { useEffect } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import config from '../../config'

const Header = () => {
    const { t } = useTranslation()
    const { user } = useContext(AuthContext)
    return (
        <Navbar collapseOnSelect expand="lg" variant="dark">
            <Navbar.Brand>
                <Link href="/">
                    <img className="nav-logo link" src="/assets/logo.png" />
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle
                style={{ border: 'none', fill: 'white' }}
                aria-controls="responsive-navbar-nav"
            />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Link href="/bots">{t('header.links.bots')}</Link>
                    {user.id && (
                        <Link href="/add">{t('header.links.addBot')}</Link>
                    )}
                    <Link href="https://discord.gg/ZDvQTzrG4k">
                        {t('header.links.community')}
                    </Link>
                </Nav>
                <Nav className="navbar-login">
                    {!user.id && (
                        <Link href={`${config.SERVER_URL}/auth/discord`}>
                            {t('header.links.login')}
                        </Link>
                    )}
                    {user.id && (
                        <div className="navbar-user-profile">
                            <Link href={`/users/me`}>
                                <img
                                    className="user-avatar"
                                    src={user.avatar}
                                />
                            </Link>
                            <Link href="/settings">
                                <img
                                    className="settings-icon"
                                    src="/assets/settings.png"
                                />
                            </Link>
                        </div>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
