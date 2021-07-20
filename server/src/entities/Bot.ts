import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToMany,
    JoinTable
} from 'typeorm'
import User from './User'
import Comment from './Comment'
import BotLibrary from '../types/bot-library.type'
import Tag from './Tag'

@Entity('bots')
class Bot extends BaseEntity {
    @PrimaryColumn()
    id: string

    @Column('text', { default: [], array: true })
    votes: Array<string>

    @Column({ default: 0, nullable: true })
    rating: number

    @Column({ nullable: true })
    library: BotLibrary

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @Column()
    name: string

    @Column({ default: false })
    verified?: boolean

    @Column()
    prefix: string

    @Column({ nullable: true, default: '' })
    avatar: string

    @Column()
    shortDescription: string

    @Column()
    longDescription: string

    @Column({ default: 0 })
    guildsCount?: number

    @Column({ nullable: true })
    supportServerURL: string

    @Column({ nullable: true })
    websiteURL: string

    @Column({ nullable: true })
    githubURL: string

    @Column({ nullable: true })
    backgroundURL: string

    @Column({ nullable: true })
    inviteURL: string

    @ManyToMany(() => User, user => user.bots, { onDelete: 'CASCADE' })
    @JoinTable()
    developers: User[]

    @ManyToOne(() => User, user => user.bots)
    owner: User

    @OneToMany(() => Comment, comment => comment.bot)
    comments: Comment[]

    @ManyToMany(() => Tag, tag => tag.bots, { onDelete: 'CASCADE' })
    @JoinTable()
    tags: Tag[]
}

export default Bot
