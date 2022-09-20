import { Nation } from "../../common/nation.entity";
import { Creator } from "../../creators/creator.entity";
import { AppDataSource } from "../../data-source";
import { CreateProductDto } from "../dto/product.dto";
import { CreatorProductCreator } from "./product.creator.service";

describe("CreatorProductCreator", () => {
    let productCreator: CreatorProductCreator;
    let connection: any;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    })

    beforeEach(() => {
        productCreator = new CreatorProductCreator();
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

            let product = await productCreator.createProduct(dto);
            
            expect(product.basePrice).toBe(dto.basePrice);
            expect(product.productAssets.length).toBe(dto.assetUrls.length);
            expect(product.productDetails.at(0).isMainDetail).toBe(true);
            expect(product.productDetails.at(0).title).toBe(dto.title);
            expect(product.productDetails.at(0).productImages.length).toBe(dto.imageUrls.length);
        })
    })
})