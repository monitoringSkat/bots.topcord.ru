import SettingsLayout from '../../layout/settings-layout'
import styles from '../../styles/pages/settings.module.scss'
import Input from '../../components/Input/Input'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import { useState } from 'react'
const SettingsPage = () => {
    const { user } = useContext(AuthContext)
    const [ bio, setBio ] = useState(user.bio)
    const [ isEdit, setEdit ] = useState(false)
    console.log(bio)
    return (
        <SettingsLayout>
            <h3>Моя учётная запись</h3>
            <div className={styles.profile}>
                <img className={styles.avatar} src={user.avatar} />
                <div style={{ width: '92.5%' }}>
                    <div className={styles.header}>
                        <div className={styles.username}>
                            {user.username}
                            <span>#{user.discriminator}</span>
                        </div>
                        <button onClick={() => setEdit(true)}>Редактировать профиль</button>
                    </div>
                    {isEdit ? 
                    <textarea maxLength={250} onChange={e => setBio(e.target.value)} value={bio} placeholder="Расскажите немного о себе..." />
                    : <div className={styles.bio}>{bio}</div>
                    }

                    {isEdit && <button className={styles.save} onClick={() => setEdit(false)}>Сохранить изменения</button>}
                </div>
            </div>
            <h4>Интеграции</h4>
        </SettingsLayout>
    )
}

export default SettingsPage
