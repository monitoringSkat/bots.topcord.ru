import { useState } from 'react'
import { useFormik } from 'formik'
import { Form } from 'react-bootstrap'
import styles from '../../../styles/pages/add.module.scss'
import Layout from '../../layout'
import Input from '../../components/Input/Input'
import fields from './fields.json'
import addFormSchema from '../../schemas/add-form.schema'
import Bot from '../../interfaces/bot.interface'
import { useRouter } from 'next/router'
import { Snackbar, Button } from '@material-ui/core'
import config from '../../config'
import http from '../../api/http'
import { useEffect } from 'react'
import api from '../../api'
import User from '../../interfaces/user.interface'
import PageWithAuth from '../../hoc/PageWithAuth'
import { useTranslation } from 'react-i18next'

const AddPage = () => {
    const { t } = useTranslation()
    const fromStringToArray = (str: string) => str.split(/\s*\,\s*/)
    const [checked, setChecked] = useState(false)
    const [bot, setBot] = useState<Bot>()
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const [isEdit, setEdit] = useState(false)
    const {
        dirty,
        values,
        errors,
        isValid,
        handleChange,
        setErrors,
        handleSubmit,
        setValues
    } = useFormik({
        initialValues: {
            id: '',
            prefix: '',
            shortDescription: '',
            longDescription: '',
            inviteURL: '',
            backgroundURL: '',
            supportServerURL: '',
            githubURL: '',
            websiteURL: '',
            library: 'discord.js',
            tags: '',
            developers: ''
        },
        validationSchema: addFormSchema,
        async onSubmit(values) {
            const tags = fromStringToArray(values.tags)
                .slice(0, 5)
                .map((t: string) => t.slice(0, 15))
            const developers = fromStringToArray(values.developers)
            const { data } = await http[isEdit ? 'put' : 'post'](
                isEdit ? `/bots/${values.id}` : '/bots',
                { ...values, tags, developers },
                {
                    headers: {
                        Authorization: `Bearer: ${localStorage.getItem(
                            config.AUTH_LOCAL_STORAGE_KEY
                        )}`
                    }
                }
            )
            if (data.statusCode === 409)
                setErrors({ ...errors, id: t("errors.sameId") })
            if (data.id) {
                setBot(data)
                setOpen(true)
            }
        }
    })

    useEffect(() => {
        if (!router.query.botId) return
        api.getBot(router.query.botId as string).then(bot => {
            if (bot && bot.id === router.query.botId) {
                const tags = bot.tags.map((tag: any) => tag.name).join()
                const developers = bot.developers
                    .map((developer: User) => developer.id)
                    .join()
                setValues({ ...values, ...bot, developers, tags })
                setEdit(true)
            }
        })
    }, [router.query.botId])

    const tags = fromStringToArray(values.tags)
        .slice(0, 5)
        .map((t: string) => t.slice(0, 15))
    const developers = fromStringToArray(values.developers)
    const handleClose = () => router.push(`/bots/${bot?.id}`)

    const action = (
        <Button onClick={handleClose}>{t("add.redirectTo")} {bot?.name}</Button>
    )

    const selectHandler = (name: string, value: string) => {
        setValues({ ...values, [name]: value })
    }
    return (
        <Layout>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                onClose={handleClose}
                message={`Бот ${bot?.name} был успешно ${
                    isEdit ? 'обновлен' : 'добавлен'
                }!`}
                action={action}
            />

            <div className={styles.title}>
                {isEdit ? t("add.editTitle") : t("add.addTitle")}
            </div>
            <form onSubmit={handleSubmit} className={styles.inputs}>
                {fields.map(
                    ({ name, hint, required, type, options }) => {
                        const placeholder = t(`add.${name}`)
                        return (
                                <div key={name} className={styles.input}>
                                    <div className={styles.field}>
                                        <div className={styles.name}>
                                            {placeholder}
                                            {required === true && '*'}
                                        </div>
                                        {hint && (
                                            <div className={styles.hint}>{t(`add.${name}_hint`)}</div>
                                        )}
                                    </div>
                                    <div className={styles.error}>
                                        {(errors as any)[name]}
                                    </div>
                                    {name === 'tags' && (
                                        <div className={styles.tags}>
                                            {tags.map(tag => (
                                                <div>{tag}</div>
                                            ))}
                                        </div>
                                    )}
                                    <Input
                                        onChange={handleChange}
                                        value={
                                            name === 'tags'
                                                ? tags
                                                : name === 'developers'
                                                ? developers
                                                : (values as any)[name]
                                        }
                                        disabled={name === 'id' && isEdit}
                                        options={options}
                                        name={name}
                                        placeholder={"..."}
                                        type={type as any}
                                        selectHandler={selectHandler}
                                    />
                                </div>
                        )
                    }
                )}
                <div className={styles.submit}>
                    <Form.Check
                        type="checkbox"
                        label={t("add.rules")}
                        checked={checked}
                        onChange={e => setChecked(!checked)}
                    />
                    <button
                        disabled={!(isValid && dirty && checked)}
                        type="submit"
                    >
                        {isEdit ? t("add.updateButton") : t("add.createButton")}
                    </button>
                </div>
            </form>
        </Layout>
    )
}

export default PageWithAuth(AddPage)
