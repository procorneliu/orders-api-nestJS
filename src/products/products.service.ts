import { Injectable, NotFoundException } from '@nestjs/common';
import { products } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { QueryPaginationDto } from '../common/dtos/query-pagination.dto';
import { PaginateOutput, paginateOutput, paginate } from '../common/utils/pagination.utils';

@Injectable()
export class ProductsService {
  constructor(private databaseService: DatabaseService) {}

  async findAllProducts(query?: QueryPaginationDto): Promise<PaginateOutput<products>> {
    const [data, total] = await Promise.all([
      await this.databaseService.products.findMany({
        ...paginate(query!),
      }),
      await this.databaseService.products.count(),
    ]);
    return paginateOutput<products>(data, total, query!);
  }

  async findProduct(id: string): Promise<products | null> {
    const product = await this.databaseService.products.findUnique({ where: { id } });

    if (product) return product;

    throw new NotFoundException('Product not found');
  }

  async createProduct(createProductDto: CreateProductDto): Promise<products> {
    const slug = createProductDto.name.toLowerCase().split(' ').join('-');

    return await this.databaseService.products.create({ data: { ...createProductDto, slug } });
  }

  async updateProduct(id: string, updateproductDto: UpdateProductDto): Promise<products> {
    try {
      const product = await this.databaseService.products.update({ data: updateproductDto, where: { id } });

      return product;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('Product not found');
      }
      throw err;
    }
  }

  async deleteProduct(id: string): Promise<null> {
    try {
      await this.databaseService.products.delete({ where: { id } });
      return null;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('Product not found');
      }
      throw err;
    }
  }
}
