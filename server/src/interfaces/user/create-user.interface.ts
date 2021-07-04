interface CreateUser {
    id: string
    discriminator: string,
    username: string,
    verified?: boolean,
    avatar: number | string,
}

export default CreateUser