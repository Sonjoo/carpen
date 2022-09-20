import { Buyer } from "src/Buyers/buyer.entity";
import { ProductDetail } from "src/products/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExchangeRate } from "./exchangeRate.entity";

@Entity()
export class Nation {
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