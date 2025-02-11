import { User } from "src/user/user.entity";
import { Entity, CreateDateColumn, UpdateDateColumn, Timestamp, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";

@Entity()
export class Admin {

    @PrimaryColumn()
    id: string;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}