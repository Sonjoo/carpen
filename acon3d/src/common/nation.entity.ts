import { Buyer } from "../Buyers/buyer.entity";
import { ProductDetail } from "../products/product.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExchangeRate } from "./exchangeRate.entity";

@Entity()
export class Nation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    nationCode: string;

    @OneToMany(() => ProductDetail, (productDetail) => productDetail.nation)
    productDetails: ProductDetail[];

    @OneToMany(() => ExchangeRate, (exchangeRate) => exchangeRate.nation)
    exchangeRates: ExchangeRate[];

    @OneToMany(() => Buyer, (buyer) => buyer.nation)
    buyers: Buyer[];
}