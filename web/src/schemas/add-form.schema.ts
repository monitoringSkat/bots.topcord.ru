import { string, object } from 'yup'
import libraries from '../data/libraries.json'

const addFormSchema = object().shape({
    id: string().min(1).required('ID не указан!'),
    name: string().min(1).required('Укажите имя бота!'),
    prefix: string().min(1).required('Префикс не указан!'),
    tags: string().min(1).required('Укажите теги бота!'),
    shortDescription: string()
        .min(1)
        .max(220, 'Превышен лимит символов (220 символов)!')
        .required('Напишите краткое описание!'),

    longDescription: string()
        .min(
            300,
            'Подробное описание бота должно содержать минимум 300 символов!'
        )
        .required('Подробное описание бота не должно быть пустым!'),

    inviteURL: string().url().required('Ссылка приглашения бота отсутствует'),
    background: string().url().nullable(),
    supportServerURL: string().url().nullable(),
    githubURL: string().url().nullable(),
    developers: string(),
    library: string().equals(libraries).default("discord.js").required('Укажите библиотеку бота!')
})

export default addFormSchema
