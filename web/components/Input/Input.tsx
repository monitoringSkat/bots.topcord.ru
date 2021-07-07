import { FC, InputHTMLAttributes, useState } from 'react'
import styles from './Input.module.css'
import Markdown from '../Markdown/Markdown'

interface Props extends InputHTMLAttributes<any> {
    type?: 'textarea'
}

const Input: FC<Props> = props => {
    const [isEdit, setEdit] = useState(true)
    switch (props.type) {
        case 'textarea':
            return (
                <div className={styles.textareaContainer}>
                    <div className={styles.buttons}>
                        <div onClick={() => setEdit(true)}>Редактировать</div>
                        <div onClick={() => setEdit(false)}>Просмотреть</div>
                    </div>
                    {isEdit && (
                        <textarea
                            {...props}
                            className={styles.textarea}
                        ></textarea>
                    )}
                    {!isEdit && (
                        <Markdown
                            className={styles.preview}
                            text={props.value as any}
                        />
                    )}
                </div>
            )
        default:
            return <input {...props} className={styles.input} />
    }
}

export default Input
