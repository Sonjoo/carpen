import { Nation } from '../common/nation.entity';
import { Creator } from '../creators/creator.entity';
import { Editor } from '../editors/editor.entity';
import { Fee } from '../fees/fee.entity';
import { CreateDateColumn, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, OneToMany, ManyToOne} from 'typeorm';
import { ProductDetailState as ProductDetailStatus, ProductStatus } from './product.enums';

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    basePrice: number;
    
    @Column({
        type: "enum",
        enum: ProductStatus,
        default: ProductStatus.CREATED
    })
    status: ProductStatus

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @OneToOne(() => Fee)
    @JoinColumn()
    fee: Fee;
 
    @OneToMany(() => ProductAsset, (productAsset) => productAsset.product)
    productAssets: ProductAsset[];   

    @OneToMany(() => ProductDetail, (productDetail) => productDetail.product)
    productDetails: ProductDetail[]

    @ManyToOne(() => Creator, (creator) => creator.products)
    creator: Creator

    @ManyToOne(() => Editor, (editor) => editor.products, {nullable: true})
    editor: Editor | null
}

@Entity()
export class ProductDetail extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: ProductDetailStatus,
        default: ProductDetailStatus.PENDING
    })
    state: ProductDetailStatus;

    @Column()
    isMainDetail: boolean;

    @Column()
    title: string;

    @Column()
    description: string;
   
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @OneToMany(() => ProductImage, (productImage) => productImage.productDetail)
    productImages: ProductImage[] | null

    @ManyToOne(() => Product, (product) => product.productDetails)
    product: Product;

    @ManyToOne(() => Nation, (nation) => nation.productDetails)
    nation: Nation
}


@Entity()
export class ProductImage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @ManyToOne(() => ProductDetail, (productDetail) => productDetail.productImages)
    productDetail: ProductDetail;
}

@Entity()
export class ProductAsset extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @ManyToOne(() => Product, (product) => product.productAssets)
    product: Product;    
}

