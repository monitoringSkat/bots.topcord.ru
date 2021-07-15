import SettingsLayout from '../../layout/settings-layout'
import styles from '../../styles/pages/settings.module.scss'
import React, { useContext } from 'react'
import AuthContext from '../../context/auth.context'
import { useState } from 'react'
import Integrations from './integrations.json'
import Input from '../../components/Input/Input'
import Tooltip from '@material-ui/core/Tooltip'
import { useFormik } from 'formik'
import axios from 'axios'
import { Snackbar } from '@material-ui/core'
import updateProfileSchema from '../../schemas/update-profile.schema'
import config from '../../config'
import http from '../../api/http'

const SettingsPage = () => {
    const { user, setUser } = useContext(AuthContext)
    const [isEdit, setEdit] = useState(false)
    const [open, setOpen] = useState(false)
    const {
        handleSubmit,
        handleChange,
        values,
        handleReset,
        errors,
        isValid,
        dirty
    } = useFormik({
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
        validationSchema: updateProfileSchema,
        onSubmit: async ({ bio, ...social }) => {
            const { data } = await http.put(
                `/users/me`,
                { bio, ...social },
                {
                    headers: {
                        Authorization: `Bearer: ${localStorage.getItem(
                            config.AUTH_LOCAL_STORAGE_KEY
                        )}`
                    }
                }
            )
            if (data === true) {
                setOpen(true)
                setUser({ ...user, bio, social })
                setEdit(false)
            }
        },
        onReset: () => {
            setEdit(false)
        }
    })

    return (
        <SettingsLayout>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                autoHideDuration={3000}
                className={styles.snackbar}
                message={`Профиль успешно обновлён!`}
            />
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
                {Object.keys(errors).length > 0 && (
                    <div className={styles.error}>Были допущены ошибки!</div>
                )}
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
                                value={(values as any)[name.toLowerCase()]}
                            />
                        ) : (
                            <span>
                                {(values as any)[name.toLowerCase()] ||
                                    'ссылка отсутсвует'}
                            </span>
                        )}
                    </div>
                ))}
            </div>
            {isEdit && isValid && dirty && (
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
