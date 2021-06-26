import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class BlackList extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    ip: string

    @Column()
    user_id: string 
}

export default BlackList