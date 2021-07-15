import { FC, InputHTMLAttributes, useState } from 'react'
import styles from './Input.module.css'
import Markdown from '../Markdown/Markdown'

interface Props extends InputHTMLAttributes<any> {
    type?: 'textarea' | 'select'
    options?: string[]
    selectHandler?: (name: string, value: string) => void
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
        case 'select':
            return (
                <select
                    className={styles.select}
                    name={props.name}
                    onChange={e =>
                        props.selectHandler?.(e.target.name, e.target.value)
                    }
                >
                    {props.options?.map(option => (
                        <option value={option} key={option}>
                            {option}
                        </option>
                    ))}
                </select>
            )
        default:
            return <input {...props} className={styles.input} />
    }
}

export default Input
