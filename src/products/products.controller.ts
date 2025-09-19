import { Controller, Get, Post, Patch, Delete, Param, Body, Query, HttpCode, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { products } from '@prisma/client';

import { ProductsService } from './products.service';
import { PaginateOutput } from '../common/utils/pagination.utils';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './dtos';
import { QueryPaginationDto } from '../common/dtos/query-pagination.dto';
import { CacheKey } from '@nestjs/cache-manager';

@CacheKey('products')
@UseGuards(AccessTokenGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiSuccessResponse(ProductResponseDto, { isArray: true, isPaginate: true })
  @Get()
  findAllProducts(@Query() query?: QueryPaginationDto): Promise<PaginateOutput<products>> {
    return this.productsService.findAllProducts(query);
  }

  @ApiSuccessResponse(ProductResponseDto)
  @Get('/:id')
  async findProduct(@Param('id') id: string) {
    const product = await this.productsService.findProduct(id);

    return product;
  }

  @ApiSuccessResponse(ProductResponseDto)
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @ApiSuccessResponse(ProductResponseDto)
  @Patch('/:id')
  updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @ApiResponse({ example: null })
  @HttpCode(204)
  @Delete('/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
