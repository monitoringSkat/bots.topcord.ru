import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm'
import User from './User'
import Comment from './Comment'
import BotLibrary from '../types/bot-library.type'

@Entity("bots")
class Bot extends BaseEntity {
    @PrimaryColumn()
    id: string

    @Column('text', { array: true, default: [] })
    votes: Array<string>

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

    @Column({ nullable: true })
    avatar: string

    @Column()
    description: string

    @Column({ default: 0 })
    guildsCount?: number

    @Column({ nullable: true })
    supportServerURL: string

    @Column({ nullable: true })
    websiteURL: string

    @Column({ nullable: true })
    githubURL: string

    @Column({ nullable: true })
    inviteURL: string

    @Column('text', { array: true, default: [] })
    tags: Array<string>

    @ManyToOne(() => User, (user) => user.bots)
    owner: User

    @OneToMany(() => Comment, (comment) => comment.bot)
    comments: Comment[]
}

export default Bot