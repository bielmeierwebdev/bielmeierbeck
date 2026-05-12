class ProductionListItemDto {
  name!: string;

  ordered!: number;

  production!: number;
}

export class CreateProductionListDto {
  items!: ProductionListItemDto[];
}
