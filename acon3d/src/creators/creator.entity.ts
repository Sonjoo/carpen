import { Product } from "../products/product.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Creator extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    pw: string;
    
    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;

    @OneToMany(() => Product, (product) => product.creator)
    products: Product[];
}