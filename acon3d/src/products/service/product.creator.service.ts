import { Injectable } from "@nestjs/common";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { Nation } from "../../common/nation.entity";
import { Creator } from "../../creators/creator.entity";
import { AppDataSource } from "../../data-source";
import { EntityManager, SelectQueryBuilder } from "typeorm";
import { CreateProductDto, ModifyProductDto  } from "../dto/product.dto";
import { Product, ProductAsset, ProductDetail, ProductImage } from "../product.entity";
import { ProductStatus } from "../product.enums";
import { ProductRetriever } from "./product.service";

@Injectable()
export class CreatorProductRetriever extends ProductRetriever {
    async listMyProducts(pageOptions: IPaginationOptions, creatorId: number, status?: ProductStatus): Promise<Pagination<Product>> {
        const queryBuilder: SelectQueryBuilder<Product> = Product.createQueryBuilder('p')
            .where("p.creatorId = :creatorId", {creatorId: creatorId});
        
        if (status !== null) {
            queryBuilder.andWhere("p.status = :status", {status: status});
        }

        return await this.listProducts(pageOptions, queryBuilder);
    }
}

@Injectable()
export class CreatorProductCreator {
    async createProduct(productDto: CreateProductDto): Promise<Product> {
        return AppDataSource.transaction(async (manager: EntityManager) => {
            let product = new Product();

            product.basePrice = productDto.basePrice;
            product.creator = await Creator.findOneBy({id: productDto.creatorId});
            product = await manager.save(product)
        
            let productDetail = await this.createMainProductDetail(productDto, product, manager);
            let productAssets = await this.createProductAssets(productDto.assetUrls, product, manager);
             
            product.productAssets = productAssets;
            product.productDetails = [productDetail];
            
            return product
        })
    }
    
    private async createProductAssets(
        urls: string[], 
        product: Product, 
        transactionManager: EntityManager
    ): Promise<ProductAsset[]> {
        let assets = new Array()
        for (let url of urls) {
            let asset = new ProductAsset();
            asset.product = product;
            asset.url = url;
            assets.push(asset)
        }

        return await transactionManager.save(assets);
    }

    private async createProductImages(
        urls: string[], 
        productDetail: ProductDetail, 
        transactionManager: EntityManager
    ): Promise<ProductImage[]> {
        let images = new Array() 
        for (let url of urls) {
            let image = new ProductImage();
            image.productDetail = productDetail;
            image.url = url;
            images.push(image)
        }

        return await transactionManager.save(images);
    }

    private async createMainProductDetail(
        productDto: CreateProductDto, 
        product: Product, 
        transactionManager: EntityManager
    ): Promise<ProductDetail> {
        let productDetail = new ProductDetail();
        productDetail.isMainDetail = true;
        productDetail.product = product;
        productDetail.title = productDto.title;
        productDetail.description = productDto.description;
        productDetail.nation = await Nation.findOneBy({nationCode: "ko"});
        
        productDetail = await transactionManager.save(productDetail);
        productDetail.productImages = await this.createProductImages(productDto.imageUrls, productDetail, transactionManager);
        
        return productDetail
    }
}
