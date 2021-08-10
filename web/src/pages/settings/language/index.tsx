import i18next from 'i18next'
import SettingsLayout from '../../../layout/settings-layout'
import languages from './languages.json'
import styles from '../../../../styles/pages/settings-language.module.scss'
import { useState } from 'react'
import PageWithAuth from '../../../hoc/PageWithAuth'
import { useTranslation } from 'react-i18next'

const LanguagePage = () => {
    const [currentLanguage, setCurrentLanguage] = useState(i18next.language)
    const { t } = useTranslation()
    const changeLanguage = (id: string) => () => {
        i18next.changeLanguage(id)
        setCurrentLanguage(id)
    }
    return (
        <SettingsLayout>
            <h3>{t('settings.menu.language')}</h3>
            <div className={styles.languages}>
                {languages.map(({ name, id, icon }) => (
                    <div
                        className={currentLanguage === id ? styles.active : ''}
                        onClick={changeLanguage(id)}
                    >
                        <div>
                            {icon} {name}
                        </div>
                    </div>
                ))}
            </div>
        </SettingsLayout>
    )
}

export default PageWithAuth(LanguagePage)
