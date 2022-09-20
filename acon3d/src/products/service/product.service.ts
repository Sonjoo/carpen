import { Injectable } from "@nestjs/common";
import { paginate, IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";
import { Product } from "../product.entity";
import { ProductStatus } from "../product.enums";

@Injectable()
export class ProductService {
    async getProduct(productId: number): Promise<Product> {
        return await Product.findOneBy({id: productId});
    }

    async listProductsByState(pageOptions: IPaginationOptions, productStatus: ProductStatus): Promise<Pagination<Product>> {
        const queryBuilder = Product.createQueryBuilder("p")
            .where("p.status = :status", {status: productStatus})
            .orderBy("p.id", "DESC")

        return await this.listProducts(pageOptions, queryBuilder);
    }

    protected async listProducts(pageOptions: IPaginationOptions, queryBuilder: SelectQueryBuilder<Product>): Promise<Pagination<Product>> {
        return paginate<Product>(queryBuilder, pageOptions);
    }
}