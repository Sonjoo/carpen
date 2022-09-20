import { Nation } from "../common/nation.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Buyer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;
    
    @Column()
    pw: string;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;

    @ManyToOne(() => Nation, (nation) => nation.buyers)
    nation: Nation;
}