import { string, object } from 'yup'
import libraries from '../data/libraries.json'

const addFormSchema = object().shape({
    id: string().min(1).required('ID не указан!'),
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

    inviteURL: string()
        .url()
        .required('Ссылка приглашения бота отсутствует')
        .test(
            'Should start with https://discord.com/oauth2/',
            'Should start with https://discord.com/oauth2/',
            value => {
                if (!value) return true
                return value?.startsWith('https://discord.com/oauth2/')
            }
        ),
    background: string().url().nullable(),
    supportServerURL: string().url().nullable(),
    websiteURL: string().url().nullable(),
    githubURL: string()
        .url()
        .nullable()
        .test('Should be Github URL', 'Should be Github URL!', value => {
            if (!value) return true
            return value?.startsWith('https://github.com')
        }),

    developers: string(),
    library: string()
        .equals(libraries)
        .default('discord.js')
        .required('Укажите библиотеку бота!')
})

export default addFormSchema
