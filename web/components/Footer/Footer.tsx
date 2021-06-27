import Link from 'next//link'

const Footer = () => (
    <footer>
        <div className="footer-top">
            <div className="footer-links">
                <div className="footer-links-group">
                    <div className="footer-links-group-name">Информация</div>
                    <Link href="">Разработчики</Link>
                    <Link href="">Руководство по API</Link>
                    <Link href="">Пожертвовать</Link>
                </div>
                <div className="footer-links-group">
                    <div className="footer-links-group-name">Политика</div>
                    <Link href="">Правила</Link>
                </div>
                <div className="footer-links-group">
                    <div className="footer-links-group-name">Ссылки</div>
                    <Link href="">Сервер поддержки</Link>
                    <Link href="">TopInfo</Link>
                </div>
            </div>
            <img src="/wumpus-rocket.png" className="footer-wumpus" />
        </div>
        <div className="footer-bottom">
            <img src="/logo.png" style={{ width: '150px' }} />
            <hr />
        </div>
    </footer>
)

export default Footer
