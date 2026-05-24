class ProductionListItemDto {
  name!: string;
  ordered!: number;
  production!: number;
}

export class CreateProductionListDto {
  date!: Date;
  items!: ProductionListItemDto[];
}
