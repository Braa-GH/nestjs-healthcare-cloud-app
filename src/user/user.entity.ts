import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Timestamp } from "typeorm";

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

    // @Column({default: false, type: "boolean"})
    // isVerified: boolean;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;
}