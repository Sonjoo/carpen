import { Nation } from "../../common/nation.entity";
import { Creator } from "../../creators/creator.entity";
import { AppDataSource } from "../../data-source";
import { CreateProductDto } from "../dto/product.create.dto";
import { Product } from "../product.entity";
import { CreatorProductService } from "./product.creator.service";

describe("CreatorProductService", () => {
    let creatorProductService: CreatorProductService;
    let connection: any;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    })

    beforeEach(() => {
        creatorProductService = new CreatorProductService();
    })

    afterAll(async () => {
        await connection.synchronize(true);
        await connection.close();
    })

    describe("createProduct", () => {
        it("Creator는 새로운 Product를 만들 수 있다.",async () => {
            let creator = new Creator();
            creator.name = 'tester';
            creator.email = 'tester333@test.com';
            creator.pw = 'test';
            creator = await creator.save();
            let nation = new Nation();
            nation.nationCode = "ko";
            nation = await nation.save();
            
            let dto = new CreateProductDto();
            dto.assetUrls = ["test1.url", "test2.url"];
            dto.imageUrls = ["testimg1.url", "testimg2.url"];
            dto.title = "title for test";
            dto.description = "deeeeeeescription";
            dto.basePrice = 100;
            dto.creatorId = creator.id;

            let product = await creatorProductService.createProduct(dto);

            product = await Product.findOne({
                relations: {
                    productDetails: true,
                    productAssets: true,
                },
                where: {
                    id: product.id,
                }
            });

            expect(product.basePrice).toBe(dto.basePrice);
            expect(product.productAssets.length).toBe(dto.assetUrls.length);
            expect(product.productDetails.at(0).isMainDetail).toBe(true);
            expect(product.productDetails.at(0).title).toBe(dto.title);
        })
    })
})