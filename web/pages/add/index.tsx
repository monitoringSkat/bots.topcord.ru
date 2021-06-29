import styles from "../../styles/pages/add.module.scss"
import Layout from "../../layout"
import Input from "../../components/Input/Input"
import fields from "./fields.json"
import { useFormik } from "formik"
import { Form } from "react-bootstrap"

const AddPage = () => {
    const { handleChange, values } = useFormik({
        initialValues: {
            name: "",
            prefix: "",
            id: "",
            shortDescription: "",
            longDescription: ""
        },
        onSubmit() {

        }
    })
    return (
    <Layout>
        <div className={styles.title}>Добавление бота</div>
        <div className={styles.inputs}>
            {fields.map(({placeholder, name, hint, required, type}) => 
                <div className={styles.input}>
                    <div className={styles.field}>
                        <div className={styles.name}>{placeholder}{required === true && "*"}</div>
                        {hint && <div className={styles.hint}>{hint}</div>}
                    </div>
                    <Input onChange={handleChange} value={(values as any)[name]} name={name} placeholder={placeholder} type={type as any} />
                </div> 
            )}
        </div>
            <div className={styles.rules}>
                <Form.Check type="checkbox" label="Я ознакомился/ознакомилась с правилами" />
            </div>
    </Layout>
    )
}

export default AddPage
