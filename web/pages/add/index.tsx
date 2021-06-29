import styles from '../../styles/pages/add.module.scss'
import Layout from '../../layout'
import Input from '../../components/Input/Input'
import fields from './fields.json'
import { useFormik } from 'formik'
import { Form } from 'react-bootstrap'
import addFormSchema from '../../schemas/add-form.schema'

const AddPage = () => {
    const { handleChange, values, errors } = useFormik({
        initialValues: {
            name: '',
            prefix: '',
            id: '',
            shortDescription: '',
            longDescription: ''
        },
        validationSchema: addFormSchema,
        onSubmit() {}
    })
    return (
        <Layout>
            <div className={styles.title}>Добавление бота</div>
            <div className={styles.inputs}>
                {fields.map(({ placeholder, name, hint, required, type }) => (
                    <div key={name} className={styles.input}>
                        <div className={styles.field}>
                            <div className={styles.name}>
                                {placeholder}
                                {required === true && '*'}
                            </div>
                            {hint && <div className={styles.hint}>{hint}</div>}
                        </div>
                        <div className={styles.error}>{(errors as any)[name]}</div>
                        <Input
                            onChange={handleChange}
                            value={(values as any)[name]}
                            name={name}
                            placeholder={placeholder}
                            type={type as any}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.submit}>
                <Form.Check
                    type="checkbox"
                    label="Я ознакомился/ознакомилась с правилами"
                />
                <button type="submit">Добавить бота</button>
            </div>
        </Layout>
    )
}

export default AddPage
