import { Controller, Get, Post, Patch, Delete, Param, Body, Query, HttpCode, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { QueryPaginationDto } from '../common/dtos/query-pagination.dto';
import { PaginateOutput } from '../common/utils/pagination.utils';
import { products } from '@prisma/client';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { ProductResponseDto } from './dtos/product-response.dto';
import { ApiResponse } from '@nestjs/swagger';

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
  findProduct(@Param('id') id: string) {
    return this.productsService.findProduct(id);
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
