import { Injectable, NotFoundException } from '@nestjs/common';
import { products } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private databaseService: DatabaseService) {}

  async findAllProducts(): Promise<products[]> {
    const products = await this.databaseService.products.findMany();

    if (products.length) return products;

    throw new NotFoundException('No products found');
  }

  async findProduct(id: string): Promise<products | null> {
    const product = await this.databaseService.products.findUnique({ where: { id } });

    if (product) return product;

    throw new NotFoundException('User not found ');
  }

  async createProduct(createProductDto: CreateProductDto): Promise<products> {
    const slug = createProductDto.name.toLowerCase().split(' ').join('-');

    return await this.databaseService.products.create({ data: { ...createProductDto, slug } });
  }

  async updateProduct(id: string, updateproductDto: UpdateProductDto): Promise<products> {
    return await this.databaseService.products.update({ data: updateproductDto, where: { id } });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.databaseService.products.delete({ where: { id } });
  }
}
