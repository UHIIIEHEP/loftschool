import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableNews1600024485374 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create sequence if not exists public.news_seq
                increment 1
                start 1
                minvalue 1
                no maxvalue;
                
            create table if not exists public.news
                (
                    news_id integer default nextval('news_seq'::regclass) not null,
                    
                    created timestamp without time zone default now(),
                    created_at timestamp without time zone default now(),
                    text text not null,
                    title text not null,
                    user_id integer not null
                );

            alter sequence public.news_seq owned by public.news.news_id;
            alter table public.news add constraint uk_new_news_id unique (news_id);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table if exists public.news cascade;

            drop sequence if exists public.news_seq;
        `);
    }

}
