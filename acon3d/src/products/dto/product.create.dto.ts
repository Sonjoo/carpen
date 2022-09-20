export class CreateProductDto {
    creatorId: number;
    title: string;
    description: string;
    assetUrls: Array<string>;
    imageUrls: Array<string>;
    basePrice: number;
}
