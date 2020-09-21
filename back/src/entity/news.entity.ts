import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";
import User from "./user.entity";

@Entity()
class News {

    @PrimaryGeneratedColumn()
    news_id: number;

    @Column()
    created_at: Date;

    @Column()
    text: string;

    @Column()
    title: string;

    @Column()
    user_id: number;

    @OneToOne(() => User, (user: User) => user.user_id)
    @JoinColumn({ name: 'user_id'})
    user: User;
}

export default News;
