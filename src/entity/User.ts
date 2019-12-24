import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity("users") // table name users to not conflict with postgres users table that already exists
export class User extends BaseEntity {
    // uuid to not expose number of records (security)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", { length: 255, unique: true })
    email: string;

    @Column("text") // any lenght for hashed pswrd
    password: string;
}
