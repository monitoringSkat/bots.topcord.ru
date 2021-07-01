import { FC } from 'react'
import styles from '../styles/layout/settings-layout.module.scss'

const SettingsLayout: FC = ({ children }) => {
    return (
        <>
            <div className={styles.menu}></div>
            {children}
        </>
    )
}

export default SettingsLayout
