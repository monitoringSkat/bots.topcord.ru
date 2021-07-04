import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
// import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const Header = () => {
    const { t } = useTranslation()
    return (
        // <Navbar className="navbar">
        //     <Navbar.Collapse id="basic-navbar-nav">
        //         <Nav className="navbar-links mr-auto">
        //             <Link href="/">{t('header.links.main')}</Link>
        //             <Link href="/bots">{t('header.links.bots')}</Link>
        //             <Link href="/add">{t('header.links.addBot')}</Link>
        //             <a href="https://discord.com/invite/TZun7tQ4Ue">
        //                 {t('header.links.community')}
        //             </a>
        //         </Nav>
        //         <Nav className="navbar-login">
        //             <Link href="/">{t('header.links.login')}</Link>
        //         </Nav>
        // </Navbar>
        <Navbar collapseOnSelect expand="lg" variant="dark">
            <Navbar.Brand>
                <img className="nav-logo" src="/assets/logo.png" />
            </Navbar.Brand>
            <Navbar.Toggle style={{ border: 'none', fill: 'white'}} aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/">{t('header.links.main')}</Nav.Link>
                    <Nav.Link href="/">{t('header.links.bots')}</Nav.Link>
                    <Nav.Link href="/">{t('header.links.addBot')}</Nav.Link>
                </Nav>
                <Nav className="navbar-login" >
                    <Nav.Link href="/">{t('header.links.login')}</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
