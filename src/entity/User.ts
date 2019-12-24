import {Entity, PrimaryColumn, Column, BaseEntity, BeforeInsert} from "typeorm";
import * as uuidv4 from "uuid/v4";

@Entity("users") // table name users to not conflict with postgres users table that already exists
export class User extends BaseEntity {
    // uuid to not expose number of records (security)
    @PrimaryColumn("uuid")
    id: string;

    @Column("varchar", { length: 255, unique: true })
    email: string;

    @Column("text") // any lenght for hashed pswrd
    password: string;

    @BeforeInsert()
    addId() {
        this.id = uuidv4();
    }
}
