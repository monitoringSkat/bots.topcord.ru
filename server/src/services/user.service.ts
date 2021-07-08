import User from '../entities/User'
import CreateUser from '../interfaces/user/create-user.interface'

class UserService {
    /**
     * @param { CreateUser } profile
     * @returns {Promise<User | null>}
     */
    static async findOrCreate(user: CreateUser): Promise<User | null> {
        try {
            const createdUser = await User.findOne(user.id)
            const avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=1024`
            if (createdUser) {
                createdUser.avatar = avatar
                await createdUser.save()
                return createdUser
            }
            const newUser = User.create({
                id: user.id,
                discriminator: user.discriminator,
                username: user.username,
                verified: user.verified ? user.verified : false,
                avatar
            })
            await newUser.save()
            return newUser
        } catch (e) {
            return null
        }
    }

    async update() {}

    async getById(): Promise<User | null> {
        return null
    }
}

export default UserService
