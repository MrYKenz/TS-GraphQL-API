import {Entity, PrimaryColumn, Column, BaseEntity, BeforeInsert} from "typeorm";
import { v4 } from "uuid";
import * as bcrypt from "bcryptjs";

@Entity("users") // table name users to not conflict with postgres users table that already exists
export class User extends BaseEntity {
    // uuid to not expose number of records (security)
    @PrimaryColumn("uuid")
    id: string;

    @Column("varchar", { length: 255, unique: true })
    email: string;

    @Column("text") // any lenght for hashed pswrd
    password: string;

    @Column("boolean", { default: false })
    approved: boolean;

    @BeforeInsert()
    addId() {
        this.id = v4();
    }
    
    @BeforeInsert()
    async hashPW() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
