import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import Bot from "./Bot"

@Entity()
class Tag extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToMany(() => Bot, bot => bot.tags)
    bots: Bot[]
}

export default Tag