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

    @Column({ select: false, nullable: true })
    ip: string

    @OneToMany(() => Comment, comment => comment.author)
    comments: Comment[]

    @Column({
        type: 'enum',
        enum: UserRoles,
        default: UserRoles.MEMBER,
        select: false
    })
    role: UserRoles
}

export default User
