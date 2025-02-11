import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Timestamp, BeforeInsert } from "typeorm";
import * as bcrypt from "bcrypt";

@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column({nullable: true})
    phone?: string;

    @Column()
    password: string;

    @Column("date")
    dob: Date;

    @Column()
    sex: string;

    @Column({nullable: true})
    profileImg?: string;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @BeforeInsert()
    encryptPassword(){
        const salt = bcrypt.genSaltSync();
        const encryptedPassword = bcrypt.hashSync(this.password, salt);
        this.password = encryptedPassword;
    }

}