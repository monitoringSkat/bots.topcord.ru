import SettingsLayout from '../../layout/settings-layout'
import styles from '../../styles/pages/settings.module.scss'
import React, { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import { useState } from 'react'
import Integrations from "./integrations.json"
import Input from '../../components/Input/Input'

const SettingsPage = () => {
    const { user } = useContext(AuthContext)
    const [bio, setBio] = useState(user.bio)
    const [isEdit, setEdit] = useState(false)

    return (
        <SettingsLayout>
            <h3>Моя учётная запись</h3>
            <div className={styles.profile}>
                <img className={styles.avatar} src={user.avatar} />
                <div style={{ width: '92.5%' }}>
                    <div className={styles.header}>
                        <div className={styles.username}>
                            <img src="/assets/verified.png" style={{width: "25px", height: "25px"}}/>
                            {user.username}
                            <span>#{user.discriminator}</span>
                        </div>
                        <button onClick={() => setEdit(true)}>
                            Редактировать профиль
                        </button>
                    </div>
                    {isEdit ? (
                        <textarea
                            maxLength={250}
                            onChange={e => setBio(e.target.value)}
                            value={bio}
                            placeholder="Расскажите немного о себе..."
                        />
                    ) : (
                        <div className={styles.bio}>{bio || "Биография отсутствует"}</div>
                    )}

                    {isEdit && (
                        <button
                            className={styles.save}
                            onClick={() => setEdit(false)}
                        >
                            Сохранить изменения
                        </button>
                    )}
                </div>
            </div>
            <h4>Интеграции</h4>
            <div className={styles.integrations}>
                {Integrations.map(integration => 
                    <a href={integration.link}>
                        <img src={`/assets/logos/${integration.name.toLowerCase()}.png`} />
                    </a>        
                )}
            </div>
            <div className={styles.interinputs}>
                {Integrations.map(({name, link}) => 
                    <div>
                        <div>{link}</div>
                        <Input placeholder={`Имя пользователя ${name}`} />
                    </div>
                )}
            </div>

        </SettingsLayout>
    )
}

export default SettingsPage
