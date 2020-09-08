import {MigrationInterface, QueryRunner} from "typeorm";

export class createUser1599714660862 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create sequence if not exists public.user_seq
                increment 1
                start 1
                minvalue 1
                no maxvalue;
                
            create table if not exists public.user
                (
                    user_id integer default nextval('user_seq'::regclass) not null,
                    
                    created timestamp without time zone default now(),

                    username character varying (100) default null,
                    surName character varying (100) default null,
                    firstName character varying (100) default null,
                    middleName character varying (100) default null,
                    password character varying (100),
                    avatar character varying (250) default null,
                    permission jsonb not null
                );

            alter sequence public.user_seq owned by public.user.user_id;

            alter table public.user add constraint uk_user_username unique (username);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table if exists public."user" cascade;

            drop sequence if exists public."user_seq";
        `);
    }

}
