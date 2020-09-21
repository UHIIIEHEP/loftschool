import {Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn} from "typeorm";
import News from "./news.entity";

@Entity()
class User {

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    username: string;

    @Column()
    surname: string;

    @Column()
    firstname: string;

    @Column()
    middlename: string;

    @Column()
    password: string;

    @Column()
    avatar: string;

    @Column({type: 'jsonb', nullable: true})
    permission: string;

    @OneToOne(() => News, (news: News) => news.news_id)
    news: News;
}

export default User;
