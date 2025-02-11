import { User } from "src/user/user.entity";
import { Entity, CreateDateColumn, UpdateDateColumn, Timestamp, OneToOne, JoinColumn, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Patient {

    @PrimaryColumn()
    id: string;

    @Column({nullable: true})
    applicationId: string;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToOne(() => User, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    @JoinColumn()
    user: User | any;
}