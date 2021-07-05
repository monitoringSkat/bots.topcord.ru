import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const Header = () => {
    const { t } = useTranslation()
    return (
        <Navbar collapseOnSelect expand="lg" variant="dark">
            <Navbar.Brand>
                <img className="nav-logo" src="/assets/logo.png" />
            </Navbar.Brand>
            <Navbar.Toggle
                style={{ border: 'none', fill: 'white' }}
                aria-controls="responsive-navbar-nav"
            />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Link href="/">{t('header.links.main')}</Link>
                    <Link href="/bots">{t('header.links.bots')}</Link>
                    <Link href="/add">{t('header.links.addBot')}</Link>
                </Nav>
                <Nav className="navbar-login">
                    <Link href="/">{t('header.links.login')}</Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
