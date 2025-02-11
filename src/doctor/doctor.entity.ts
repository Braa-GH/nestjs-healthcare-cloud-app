import { Specialty } from "src/specialty/specialty.entity";
import { User } from "src/user/user.entity";
import { Entity, CreateDateColumn, UpdateDateColumn, Timestamp, OneToOne, JoinColumn, PrimaryColumn, ManyToOne } from "typeorm";

@Entity()
export class Doctor {

    @PrimaryColumn()
    id: string;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Specialty, specialty => specialty.doctors)
    specialty: Specialty;
}