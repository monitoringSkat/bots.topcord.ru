import { useState } from 'react'
import { useFormik } from 'formik'
import { Form } from 'react-bootstrap'
import styles from '../../styles/pages/add.module.scss'
import Layout from '../../layout'
import Input from '../../components/Input/Input'
import fields from './fields.json'
import addFormSchema from '../../schemas/add-form.schema'
import http from '../../axios/http'
import Bot from '../../interfaces/bot.interface'
import { useRouter } from 'next/router'
import { Snackbar, Button } from '@material-ui/core'

const AddPage = () => {
    const fromStringToArray = (string: string) => string.split(/\s*\,\s*/)
    const [checked, setChecked] = useState(false)
    const [bot, setBot] = useState<Bot>()
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const {
        handleChange,
        values,
        errors,
        setErrors,
        handleSubmit,
        dirty,
        isValid
    } = useFormik({
        initialValues: {
            id: '',
            name: '',
            prefix: '',
            shortDescription: '',
            longDescription: '',
            inviteURL: '',
            backgroundURL: '',
            supportServerURL: '',
            githubURL: '',
            websiteURL: '',
            library: '',
            tags: '',
            developers: ''
        },
        validationSchema: addFormSchema,
        async onSubmit(values) {
            const tags = fromStringToArray(values.tags)
                .slice(0, 5)
                .map((t: string) => t.slice(0, 15))
            const developers = fromStringToArray(values.developers)
            const { data } = await http.post('/bots', {
                ...values,
                tags,
                developers
            })
            if (data.statusCode === 409)
                setErrors({ ...errors, id: 'Такой ID уже существует!' })
            if (data.id) {
                setBot(data)
                setOpen(true)
            }
        }
    })
    const tags = fromStringToArray(values.tags)
        .slice(0, 5)
        .map((t: string) => t.slice(0, 15))
    const developers = fromStringToArray(values.developers)
    const handleClose = () => router.push(`/bots/${bot?.id}`)

    const action = (
        <Button onClick={handleClose}>Перейти на страницу {bot?.name}</Button>
    )
    return (
        <Layout>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                onClose={handleClose}
                message={`Бот ${bot?.name} был успешно добавлен!`}
                action={action}
            />

            <div className={styles.title}>Добавление бота</div>
            <form onSubmit={handleSubmit} className={styles.inputs}>
                {fields.map(({ placeholder, name, hint, required, type }) => (
                    <div key={name} className={styles.input}>
                        <div className={styles.field}>
                            <div className={styles.name}>
                                {placeholder}
                                {required === true && '*'}
                            </div>
                            {hint && <div className={styles.hint}>{hint}</div>}
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
                            name={name}
                            placeholder={placeholder}
                            type={type as any}
                        />
                    </div>
                ))}
                <div className={styles.submit}>
                    <Form.Check
                        type="checkbox"
                        label="Я ознакомился/ознакомилась с правилами"
                        checked={checked}
                        onChange={e => setChecked(!checked)}
                    />
                    <button
                        disabled={!(isValid && dirty && checked)}
                        type="submit"
                    >
                        Добавить бота
                    </button>
                </div>
            </form>
        </Layout>
    )
}

export default AddPage
