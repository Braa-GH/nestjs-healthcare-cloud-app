
import { Doctor } from "src/doctor/doctor.entity";
import { Entity, CreateDateColumn, UpdateDateColumn, Timestamp,PrimaryColumn, Column, OneToMany } from "typeorm";

@Entity()
export class Specialty {

    @PrimaryColumn()
    id: string;

    @Column({unique: true})
    name: string;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToMany(() => Doctor, doctor => doctor.specialty, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    doctors: Doctor[];

}