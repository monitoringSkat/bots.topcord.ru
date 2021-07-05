import React, { useEffect } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const Header = () => {
    const { t } = useTranslation()
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
                    <Nav.Link href="/">{t('header.links.bots')}</Nav.Link>
                    <Nav.Link href="/">{t('header.links.addBot')}</Nav.Link>
                    <Nav.Link href="/">{t('header.links.community')}</Nav.Link>
                    <Nav.Link href="/">{t('header.links.partners')}</Nav.Link>
                </Nav>
                <Nav className="navbar-login">
                    <Nav.Link href="/">{t('header.links.login')}</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
