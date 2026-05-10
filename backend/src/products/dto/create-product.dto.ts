import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

import { ProductCategory, ProductType } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsEnum(ProductType)
  type: ProductType;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsBoolean()
  active: boolean;

  @IsNumber()
  price: number;
}
