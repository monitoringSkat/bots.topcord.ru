import { useState } from "react"
import { useFormik } from "formik"
import { Form } from 'react-bootstrap'
import styles from '../../styles/pages/add.module.scss'
import Layout from '../../layout'
import Input from '../../components/Input/Input'
import fields from './fields.json'
import addFormSchema from '../../schemas/add-form.schema'

const AddPage = () => {
    const [ checked, setChecked ] = useState(false)
    const { handleChange, values, errors, handleSubmit, dirty, isValid } = useFormik({
        initialValues: { 
            id: "",
            name: "",
            prefix: "",
            shortDescription: "",
            longDescription: "",
            inviteURL: "",
            backgroundURL: "",
            supportServerURL: "",
            githubURL: "",
            websiteURL: "",
            library: "",
            tags: "",
            developers: "",
        },
        validationSchema: addFormSchema,
        onSubmit(values) {
            console.log("submit")
        }
    })
    const tags = values.tags.split(/\s*\,\s*/).slice(0, 5).map((t: string) => t.slice(0, 15))
    return (
        <Layout>
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
                        { name === "tags" && 
                            <div className={styles.tags}>
                                { tags.map(tag => <div>{tag}</div>) }
                            </div> 
                        }
                        <Input
                            onChange={handleChange}
                            value={name === "tags" ? tags : (values as any)[name]}
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
                    <button disabled={!(isValid && dirty && checked)} type="submit">Добавить бота</button>
                </div>
            </form>
        </Layout>
    )
}

export default AddPage
