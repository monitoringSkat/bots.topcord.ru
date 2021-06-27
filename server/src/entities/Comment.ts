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

    @ManyToOne(() => User, user => user.comments)
    author: User

    @Column({ default: new Date().toLocaleDateString() })
    date: string

    @ManyToOne(() => Bot, bot => bot.comments)
    bot: Bot
}

export default Comment
