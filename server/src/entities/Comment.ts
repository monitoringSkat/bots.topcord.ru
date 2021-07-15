import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm'
import Bot from './Bot'
import User from './User'

@Entity('comments')
class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    text: string

    @Column()
    rating: number

    @ManyToOne(() => User, user => user.comments)
    author: User

    @Column({ default: new Date().toLocaleDateString() })
    date: string

    @Column('text', { default: [], array: true })
    likes: string[]

    @Column('text', { default: [], array: true })
    dislikes: string[]

    @ManyToOne(() => Bot, bot => bot.comments)
    bot: Bot
}

export default Comment
