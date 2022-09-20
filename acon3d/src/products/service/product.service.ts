import { Injectable } from "@nestjs/common";
import { paginate, IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { Nation } from "src/common/nation.entity";
import { EntityManager } from "typeorm";
import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";
import { ModifyProductDto } from "../dto/product.dto";
import { Product, ProductAsset, ProductDetail, ProductImage } from "../product.entity";
import { ProductDetailState, ProductStatus } from "../product.enums";

@Injectable()
export class ProductRetriever {
    async getProduct(productId: number): Promise<Product> {
        return await Product.findOne({
            where:{
                id: productId,
                productDetails: {
                    isMainDetail: true
                }
            },
            relations: {
                productDetails: {
                    productImages: true
                },
                productAssets: true
            }
        });
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

@Injectable()
export class ProductModifier {
    async modifyOpnedProductDetail(
        product: Product,
        productDto: ModifyProductDto,
        transactionManager: EntityManager
    ): Promise<ProductDetail> {
        let productDetail = await ProductDetail.findOneBy({
            product: {id: product.id}, 
            nation: {id: productDto.nationId},
            status: ProductDetailState.PENDING
        })

        if (productDetail === null) {
            productDetail = new ProductDetail();
            productDetail.product = product;
            productDetail.nation = await Nation.findOneBy({id: productDto.nationId})   
        }

        productDetail.title = productDto.title;
        productDetail.description = productDto.description;

        return await transactionManager.save(productDetail);
    }

    async modifyProductDetail(
        productDetail: ProductDetail,
        title: string,
        description: string,
        transactionManager: EntityManager
    ): Promise<ProductDetail> {
        productDetail.title = title;
        productDetail.description = description;

        return await transactionManager.save(productDetail);
    }

    async modifyProductPrice(
        product: Product, 
        transactionManager: EntityManager, 
        changedPrice: number
    ): Promise<Product> {
        product.basePrice = changedPrice;
        return transactionManager.save(product);
    }

    async modifyProductAssets(
        assetUrls: string[], 
        product: Product, 
        transactionManager: EntityManager
    ): Promise<ProductAsset[]> {
        const assets = await ProductAsset.findBy({product: {id: product.id}});
        transactionManager.remove(assets);
        
        const newAssets = [];
        for (let url of assetUrls) {
            const newAsset = new ProductAsset();
            newAsset.product = product;
            newAsset.url = url;
            newAssets.push(newAsset);
        }

        return await transactionManager.save(newAssets);
    }

   async modifyProductImages(
        productDetail: ProductDetail,
        imageUrls: string[],
        transactionManager: EntityManager 
   ): Promise<ProductImage[]> {
        const images = await ProductImage.findBy({productDetail: {id: productDetail.id}});
        transactionManager.remove(images);

        const newImages = [];
        for (let url of imageUrls) {
            const newImage = new ProductImage();
            newImage.productDetail = productDetail;
            newImage.url = url;
            newImages.push(newImage);
        }

        return await transactionManager.save(newImages);
   }
}
