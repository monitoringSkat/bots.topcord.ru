import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'

const Header = () => (
    <Navbar className="navbar">
        <Navbar.Brand href="/">
            <img className="nav-logo" src="/logo.png" />
        </Navbar.Brand>
        <Nav className="navbar-links mr-auto">
            <Nav.Link href="/">Главная</Nav.Link>
            <Nav.Link href="/bots">Боты</Nav.Link>
            <Nav.Link href="/features">Добавить бота</Nav.Link>
            <Nav.Link href="/pricing">Сообщество</Nav.Link>
        </Nav>
        <Nav className="navbar-login">
            <Nav.Link href="/">Войти</Nav.Link>
        </Nav>
    </Navbar>
)

export default Header
