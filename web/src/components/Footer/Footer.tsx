import Link from 'next//link'
import { Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Footer = () => {
    const { t } = useTranslation()
    return (
        <footer>
            <div className="footer-top">
                <Row>
                    <Col className="col-sm footer-links-group">
                        <div className="footer-links-group-name">
                            {t('footer.categories.info')}
                        </div>
                        <Link href="/developers">
                            {t('footer.links.developers')}
                        </Link>
                        <a href="https://docs.topcord.ru/">{t('footer.links.documentation')}</a>
                        <Link href="">{t('footer.links.donate')}</Link>
                    </Col>
                    <Col className="col-sm footer-links-group">
                        <div className="footer-links-group-name">
                            {t('footer.categories.politics')}
                        </div>
                        <Link href="">{t('footer.links.rules')}</Link>
                    </Col>
                    <Col className="col-sm footer-links-group">
                        <div className="footer-links-group-name">
                            {t('footer.categories.links')}
                        </div>
                        <a href="https://discord.gg/6uwt4vzptZ">{t('footer.links.support')}</a>
                        <a href="https://info.topcord.ru/">{t('footer.links.topinfo')}</a>
                    </Col>
                </Row>
                <img
                    src="/assets/wumpus-rocket.png"
                    className="footer-wumpus"
                />
            </div>
            <div className="footer-bottom">
                <img src="/assets/logo.png" style={{ width: '150px' }} />
                <hr />
            </div>
        </footer>
    )
}

export default Footer
