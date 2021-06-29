import { string, object, array }  from "yup"


const addFormSchema = object()
.shape({
    id: string().required('Required'),
    name: string().required('Required'),
    prefix: string().required('Required'),
    tags: array().required('Required'),
    shortDescription: string().max(50).required('Required'),
    longDescription: string().min(300).required('Required'),
    inviteURL: string().url().required('Required'),
    background: string().url(),
    supportServerURL: string().url(),
    githubURL: string().url(),
    developers: array(),
    library: string(),
});

export default addFormSchema