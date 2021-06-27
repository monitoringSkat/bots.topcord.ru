import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import Link from "next/link"

const Header = () => (
    <Navbar className="navbar">
        <Navbar.Brand href="/">
            <img className="nav-logo" src="/assets/logo.png" />
        </Navbar.Brand>
        <Nav className="navbar-links mr-auto">
            <Link href="/">Главная</Link>
            <Link href="/bots">Боты</Link>
            <Link href="/add">Добавить бота</Link>
            <a href="https://discord.com/invite/TZun7tQ4Ue">Сообщество</a>
        </Nav>
        <Nav className="navbar-login">
            <Link href="/">Войти</Link>
        </Nav>
    </Navbar>
)

export default Header
