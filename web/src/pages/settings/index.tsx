import SettingsLayout from '../../layout/settings-layout'
import styles from '../../../styles/pages/settings.module.scss'
import React, { useContext, useState } from 'react'
import AuthContext from '../../context/auth.context'
import Integrations from './integrations.json'
import Input from '../../components/Input/Input'
import { useFormik } from 'formik'
import { Snackbar, Tooltip } from '@material-ui/core'
import config from '../../config'
import http from '../../api/http'
import { Col } from 'react-bootstrap'
import PageWithAuth from '../../hoc/PageWithAuth'
import { useTranslation } from 'react-i18next'

const SettingsPage = () => {
    const { t } = useTranslation()
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
        validate(values) {
            const errors: any = {}
            if (
                values.github &&
                !values.github?.startsWith('https://github.com')
            )
                errors.github = "'Should be Github URL!"
            if (values.vk && !values.vk?.startsWith('https://vk.com/'))
                errors.vk = "'Should be VK URL!"
            if (
                values.youtube &&
                !values.youtube?.startsWith('https://www.youtube.com/channel/')
            )
                errors.youtube = "'Should be Youtube URL!"
            if (
                values.twitch &&
                !values.twitch?.startsWith('https://www.twitch.tv')
            )
                errors.twitch = "'Should be Twitch URL!"
            if (
                values.twitter &&
                !values.twitter?.startsWith('https://twitter.com/')
            )
                errors.twitter = "'Should be Twitter URL!"
            if (values.telegram && !values.telegram?.startsWith('https://t.me'))
                errors.telegram = "'Should be Telegram URL!"
            if (
                values.steam &&
                !values.steam?.startsWith('https://steamcommunity.com/id/')
            )
                errors.steam = "'Should be Steam URL!"
            if (
                values.spotify &&
                !values.spotify?.startsWith('http://open.spotify.com/user/')
            )
                errors.spotify = "'Should be Spotify URL!"
            if (
                values.facebook &&
                !values.facebook?.startsWith('https://www.facebook.com')
            )
                errors.facebook = "'Should be Facebook URL!"
            if (
                values.instagram &&
                !values.instagram?.startsWith('https://www.instagram.com/')
            )
                errors.instagram = "'Should be Instagram URL!"
            if (
                values.reddit &&
                !values.reddit?.startsWith('https://www.reddit.com/user')
            )
                errors.reddit = "'Should be Reddit URL!"
            return errors
        },
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
            <Col>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={open}
                    autoHideDuration={3000}
                    className={styles.snackbar}
                    message={t('settings.accountUpdateSuccess')}
                />
                <h3>{t('settings.account')}</h3>
                <div className={styles.profile}>
                    <div className={styles.avatar}>
                        <img className={styles.avatar} src={user.avatar} />
                    </div>
                    <div style={{ width: '92.5%' }}>
                        <div className={styles.header}>
                            <div className={styles.username}>
                                <Tooltip
                                    title={t('settings.verified') || ''}
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
                                {t('buttons.edit')}
                            </button>
                        </div>
                        {isEdit ? (
                            <textarea
                                maxLength={250}
                                onChange={handleChange}
                                value={values.bio}
                                className={styles.bioTextarea}
                                name="bio"
                                style={{ width: '90%' }}
                                placeholder={t('settings.bioPlaceholder')}
                            />
                        ) : (
                            <div className={styles.bio}>
                                {values.bio || t('settings.bioNotProvided')}
                            </div>
                        )}
                    </div>
                </div>
                <h4>{t('settings.intergrations')}</h4>
                <div className={styles.interinputs}>
                    {Object.keys(errors).length > 0 && (
                        <div className={styles.error}>
                            {t('settings.errors')}
                        </div>
                    )}
                    {Integrations.map(({ name }) => (
                        <div>
                            <div className={styles.image}>
                                <img
                                    src={`/assets/logos/${name.toLowerCase()}.png`}
                                />
                            </div>
                            {isEdit ? (
                                <Input
                                    placeholder={name}
                                    onChange={handleChange}
                                    name={name.toLowerCase()}
                                    value={(values as any)[name.toLowerCase()]}
                                />
                            ) : (
                                <div className={styles.link}>
                                    {(values as any)[name.toLowerCase()] ||
                                        t('settings.emptyLink')}
                                </div>
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
                            {t('buttons.cancel')}
                        </button>
                        <button type="submit" className={styles.save}>
                            {t('buttons.save')}
                        </button>
                    </form>
                )}
            </Col>
        </SettingsLayout>
    )
}

export default PageWithAuth(SettingsPage)
