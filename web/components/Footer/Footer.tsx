import Link from 'next//link'
import { Col, Row } from 'react-bootstrap'

const Footer = () => (
    <footer>
        <div className="footer-top">
            <Row>
                <Col className="col-sm footer-links-group">
                    <div className="footer-links-group-name">Информация</div>
                    <Link href="/developers">Разработчики</Link>
                    <Link href="">Руководство по API</Link>
                    <Link href="">Пожертвовать</Link>
                </Col>
                <Col className="col-sm footer-links-group">
                    <div className="footer-links-group-name">Политика</div>
                    <Link href="">Правила</Link>
                </Col>
                <Col className="col-sm footer-links-group">
                    <div className="footer-links-group-name">Ссылки</div>
                    <Link href="">Сервер поддержки</Link>
                    <Link href="">TopInfo</Link>
                </Col>
            </Row>
            <img src="/assets/wumpus-rocket.png" className="footer-wumpus" />
        </div>
        <div className="footer-bottom">
            <img src="/assets/logo.png" style={{ width: '150px' }} />
            <hr />
        </div>
    </footer>
)

export default Footer
