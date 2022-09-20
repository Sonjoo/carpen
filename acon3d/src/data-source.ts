import { DataSource } from "typeorm";
import { Buyer } from "./Buyers/buyer.entity";
import { ExchangeRate } from "./common/exchangeRate.entity";
import { Nation } from "./common/nation.entity";
import { Creator } from "./creators/creator.entity";
import { Editor } from "./editors/editor.enity";
import { Fee } from "./fees/fee.entity";
import { Product, ProductAsset, ProductDetail, ProductImage } from "./products/product.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "test1234",
    database: "acon",
    synchronize: true,
    logging: true,
    entities: [
        Product,
        ProductAsset,
        ProductImage,
        ProductDetail,
        Buyer,
        Creator,
        Editor,
        Fee,
        Nation,
        ExchangeRate
    ],
    subscribers: [],
    migrations: [],
})