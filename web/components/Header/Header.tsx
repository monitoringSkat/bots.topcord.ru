import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const Header = () => {
    const { t } = useTranslation()
    return (
        <Navbar className="navbar">
            <Navbar.Brand href="/">
                <img className="nav-logo" src="/assets/logo.png" />
            </Navbar.Brand>
            <Nav className="navbar-links mr-auto">
                <Link href="/">{t('header.links.main')}</Link>
                <Link href="/bots">{t('header.links.bots')}</Link>
                <Link href="/add">{t('header.links.addBot')}</Link>
                <a href="https://discord.com/invite/TZun7tQ4Ue">
                    {t('header.links.community')}
                </a>
            </Nav>
            <Nav className="navbar-login">
                <Link href="/">{t('header.links.login')}</Link>
            </Nav>
        </Navbar>
    )
}

export default Header
