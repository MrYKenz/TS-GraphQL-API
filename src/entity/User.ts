import {Entity, PrimaryColumn, Column, BeforeInsert, BaseEntity} from "typeorm";
import * as uuidv4 from "uuid/v4"; // prevents es export= error 

@Entity("users") // table name users to not conflict with postgres users table that already exists
export class User extends BaseEntity {
    // uuid to not expose number of records (security)
    @PrimaryColumn("uuid")
    id: string;

    @Column("varchar", { length: 255 })
    email: string;

    @Column("text") // any lenght for hashed pswrd
    password: string;

    @BeforeInsert()
    addID() {this.id = uuidv4()}
}
