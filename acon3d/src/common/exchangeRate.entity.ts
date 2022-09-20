import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Nation } from "./nation.entity";

@Entity()
export class ExchangeRate extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dealBasR: number;

    @Column()
    curUnit: Date;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;

    @ManyToOne(() => Nation, (nation) => nation.exchangeRates)
    nation: Nation
}