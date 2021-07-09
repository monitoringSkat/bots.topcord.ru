import SettingsLayout from '../../layout/settings-layout'
import styles from '../../styles/pages/settings.module.scss'
import React, { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import { useState } from 'react'
import Integrations from './integrations.json'
import Input from '../../components/Input/Input'
import Tooltip from '@material-ui/core/Tooltip'
import { useFormik } from 'formik'

const SettingsPage = () => {
    const { user } = useContext(AuthContext)
    const [isEdit, setEdit] = useState(false)

    const { handleSubmit, handleChange, values, errors, handleReset } =
        useFormik({
            initialValues: {
                github: user.social.github,
                vk: user.social.vk,
                youtube: user.social.youtube,
                twitch: user.social.twitch,
                reddit: user.social.reddit,
                twitter: user.social.twitter,
                instagram: user.social.instagram,
                steam: user.social.steam,
                facebook: user.social.facebook,
                telegram: user.social.telegram,
                spotify: user.social.spotify,
                bio: user.bio
            },
            onSubmit: () => {
                setEdit(false)
            },
            onReset: () => {
                setEdit(false)
            }
        })

    console.log(values)

    return (
        <SettingsLayout>
            <h3>Моя учётная запись</h3>
            <div className={styles.profile}>
                <img className={styles.avatar} src={user.avatar} />
                <div style={{ width: '92.5%' }}>
                    <div className={styles.header}>
                        <div className={styles.username}>
                            <Tooltip
                                title="Верефицированный"
                                placement="bottom"
                            >
                                <img
                                    src="/assets/verified.png"
                                    className="verified"
                                />
                            </Tooltip>
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
                            onChange={handleChange}
                            value={values.bio}
                            name="bio"
                            placeholder="Расскажите немного о себе..."
                        />
                    ) : (
                        <div className={styles.bio}>
                            {values.bio || 'Биография отсутствует'}
                        </div>
                    )}
                </div>
            </div>
            <h4>Интеграции</h4>
            <div className={styles.interinputs}>
                {Integrations.map(({ name }) => (
                    <div>
                        <div>
                            <img
                                src={`/assets/logos/${name.toLowerCase()}.png`}
                            />
                        </div>
                        {isEdit ? (
                            <Input
                                placeholder={`Ссылка на профиль ${name}`}
                                onChange={handleChange}
                                name={name.toLowerCase()}
                            />
                        ) : (
                            <span>
                                {(values as any)[name] || 'ссылка отсутсвует'}
                            </span>
                        )}
                    </div>
                ))}
            </div>
            {isEdit && (
                <form
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                    className={styles.controls}
                >
                    <button type="reset" className={styles.cancel}>
                        Отмена
                    </button>
                    <button type="submit" className={styles.save}>
                        Сохранить изменения
                    </button>
                </form>
            )}
        </SettingsLayout>
    )
}

export default SettingsPage
