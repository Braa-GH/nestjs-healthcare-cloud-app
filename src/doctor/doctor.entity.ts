import { Specialty } from "src/specialty/specialty.entity";
import { User } from "src/user/user.entity";
import { Entity, CreateDateColumn, UpdateDateColumn, Timestamp, OneToOne, JoinColumn, PrimaryColumn, ManyToOne, Column } from "typeorm";

@Entity()
export class Doctor {
    @PrimaryColumn()
    id: string;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToOne(() => User, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    @JoinColumn()
    user: User | any;

    @ManyToOne(() => Specialty, specialty => specialty.doctors, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    specialty: string | Specialty;

    @Column({nullable: true})
    applicationId: string;
}