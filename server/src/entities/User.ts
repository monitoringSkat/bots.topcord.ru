import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { UserRoles } from '../enums'
import Bot from './Bot'
import Comment from './Comment'

@Entity('users')
class User extends BaseEntity {
    @PrimaryColumn()
    id: string

    @Column()
    username: string

    @Column()
    discriminator: string

    @Column()
    avatar: string

    @Column({ default: false })
    verified: boolean

    @OneToMany(() => Bot, bot => bot.owner)
    bots: Bot[]

    @OneToMany(() => User, user => user.followers)
    following: User[]

    @OneToMany(() => User, user => user.following)
    followers: User[]

    @Column({ select: false, nullable: true })
    ip: string

    @OneToMany(() => Comment, comment => comment.author)
    comments: Comment[]

    @Column({ default: "" })
    bio: string

    @Column({
        type: 'enum',
        enum: UserRoles,
        default: UserRoles.MEMBER,
    })
    role: UserRoles
}

export default User
