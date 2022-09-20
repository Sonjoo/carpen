import { Injectable } from "@nestjs/common";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { Nation } from "../../common/nation.entity";
import { Creator } from "../../creators/creator.entity";
import { AppDataSource } from "../../data-source";
import { SelectQueryBuilder } from "typeorm";
import { CreateProductDto } from "../dto/product.create.dto";
import { Product, ProductAsset, ProductDetail, ProductImage } from "../product.entity";
import { ProductStatus } from "../product.enums";
import { ProductService } from "./product.service";

@Injectable()
export class CreatorProductService extends ProductService {
    async listMyProducts(pageOptions: IPaginationOptions, creatorId: number, status?: ProductStatus): Promise<Pagination<Product>> {
        const queryBuilder: SelectQueryBuilder<Product> = Product.createQueryBuilder('p')
            .where("p.creatorId = :creatorId", {creatorId: creatorId});
        
        if (status !== null) {
            queryBuilder.andWhere("p.status = :status", {status: status});
        }

        return await this.listProducts(pageOptions, queryBuilder);
    }

    async createProduct(productDto: CreateProductDto): Promise<Product> {
        return AppDataSource.transaction(async (manager) => {
            let product = new Product();

            product.basePrice = productDto.basePrice;
            product.creator = await Creator.findOneBy({id: productDto.creatorId});
            product = await manager.save(product)
        
            await this.createMainProductDetail(productDto, product, manager);
            await this.createProductAssets(productDto.assetUrls, product, manager);
            return product;
        })
    }

    private async createProductAssets(urls: string[], product: Product, transactionManager): Promise<ProductAsset[]> {
        let assets = new Array()
        for (let url of urls) {
            let asset = new ProductAsset();
            asset.product = product;
            asset.url = url;
            assets.push(asset)
        }

        return await transactionManager.save(assets);
    }

    private async createProductImages(urls: string[], productDetail: ProductDetail, transactionManager): Promise<ProductImage[]> {
        let images = new Array() 
        for (let url of urls) {
            let image = new ProductImage();
            image.productDetail = productDetail;
            image.url = url;
            images.push(image)
        }

        return await transactionManager.save(images);
    }

    private async createMainProductDetail(productDto: CreateProductDto, product: Product, transactionManager): Promise<ProductDetail> {
        let productDetail = new ProductDetail();
        productDetail.isMainDetail = true;
        productDetail.product = product;
        productDetail.title = productDto.title;
        productDetail.description = productDto.description;
        productDetail.nation = await Nation.findOneBy({nationCode: "ko"});

        productDetail = await transactionManager.save(productDetail);

        await this.createProductImages(productDto.imageUrls, productDetail, transactionManager);

        return productDetail
    }
}