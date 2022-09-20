export class CreateProductDto {
    creatorId: number;
    title: string;
    description: string;
    assetUrls: Array<string>;
    imageUrls: Array<string>;
    basePrice: number;
}

export class ModifyProductDto {
    id: number;
    title?: string;
    description?: string;
    nationId: number;
    imageUrls?: string[];
    basePrice?: number;
    assetUrls?: string[];
}
