import { AppDataSource } from "../../data-source";
import { Creator } from "../../creators/creator.entity";
import { Product } from "../product.entity";
import { ProductService } from "./product.service";
import { ProductStatus } from "../product.enums";


describe('ProductService', () => {
    let productService: ProductService;
    let connection: any;

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(() => {
        productService = new ProductService();
    });
  
    afterAll(async () => {
        await connection.synchronize(true);
        await connection.close();
    })

    describe('getProduct', () => {
      it('존재하는 id로 product를 찾을 수 있다.', async () => {
        let creator = new Creator();
        creator.name = 'tester';
        creator.email = 'tester@test.com';
        creator.pw = 'test';
        creator = await creator.save();
        const product = new Product();
        product.basePrice = 100;
        product.creator = creator;
        const createdProduct = await product.save();
  
        expect((await productService.getProduct(createdProduct.id)).id).toBe(createdProduct.id);
      });
    });

    describe("listProducts", () => {
        it("상태에 따라 다른 product를 찾을 수 있다.",async () => {
            let creator = new Creator();
            creator.name = 'tester';
            creator.email = 'tester2@test.com';
            creator.pw = 'test';
            creator = await creator.save();
            let openedCount = 0;
            let createdCount = 1;
            let examiningCount = 0;
            for (let i = 0; i < 20; i++) {
                let product = new Product();
                product.basePrice = 100;
                product.creator = creator;
                let seperator = i % 3;
                if (seperator == 0) {
                    product.status = ProductStatus.EXAMINING;
                    examiningCount++;
                } else if (seperator == 1) {
                    product.status = ProductStatus.OPEN;
                    openedCount++;
                } else {
                    createdCount++;
                }
                await product.save();
            }
            
            expect((await productService.listProductsByState({
                page: 1, 
                limit: 20,
                route: 'https://test1234/products'
            }, ProductStatus.CREATED)).meta.itemCount
            ).toBe(createdCount)

            expect((await productService.listProductsByState({
                page: 1, 
                limit: 20,
                route: 'https://test1234/products'
            }, ProductStatus.EXAMINING)).meta.itemCount
            ).toBe(examiningCount)
            
            expect((await productService.listProductsByState({
                page: 1, 
                limit: 20,
                route: 'https://test1234/products'
            }, ProductStatus.OPEN)).meta.itemCount
            ).toBe(openedCount)
        })
    })
  });