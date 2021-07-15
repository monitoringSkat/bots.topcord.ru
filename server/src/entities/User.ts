import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryColumn
} from 'typeorm'
import { UserRoles } from '../enums'
import Social from '../interfaces/user/social.interface'
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

    @Column({ select: false, nullable: true })
    ip: string

    @Column({ default: 'no bio.' })
    bio: string

    @Column('json', { default: '{}' })
    social: Social

    @Column({
        type: 'enum',
        enum: UserRoles,
        default: UserRoles.MEMBER
    })
    role: UserRoles

    // RELATIONS

    @OneToMany(() => Bot, bot => bot.owner)
    bots: Bot[]

    @ManyToMany(() => User, user => user.following)
    @JoinTable()
    followers: User[]

    @ManyToMany(() => User, user => user.followers)
    following: User[]

    @OneToMany(() => Comment, comment => comment.author)
    comments: Comment[]
}

export default User
