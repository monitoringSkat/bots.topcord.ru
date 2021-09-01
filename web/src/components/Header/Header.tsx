import React, { useEffect } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import config from '../../config'
import { Button } from '@material-ui/core'

const Header = () => {
    const { t } = useTranslation()
    const { user } = useContext(AuthContext)
    return (
        <Navbar collapseOnSelect expand="lg" variant="dark">
            <Navbar.Brand>
                <Link href="/">
                    <img
                        className="nav-logo link"
                        alt="TopCord Logo"
                        src="/assets/logo.png"
                    />
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle
                style={{ border: 'none', fill: 'white' }}
                aria-controls="responsive-navbar-nav"
            />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Button href="/add">{t('header.links.addBot')}</Button>
                    <Button href="/bots">{t('header.links.bots')}</Button>
                    <Button href="https://discord.gg/ZDvQTzrG4k">
                        {t('header.links.community')}
                    </Button>
                </Nav>
                <Nav className="navbar-login">
                    {!user.id && (
                        <Button href={`${config.SERVER_URL}/auth/discord`}>
                            {t('header.links.login')}
                        </Button>
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
