import { Controller, Param, Body, Get, Post, Patch, Delete, Query, HttpCode, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dtos/create-user.dto';
import { UpdateUsersDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { QueryPaginationDto } from '../common/dtos/query-pagination.dto';
import { PaginateOutput } from '../common/utils/pagination.utils';
import { UsersPublic } from './users.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { ApiForbiddenResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';

@ApiForbiddenResponse({ description: 'You don"t have enough permission!' })
@ApiUnauthorizedResponse({ description: 'You"re not logged in. Missing/invalid JWT token.' })
@Roles('ADMIN')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiSuccessResponse(UserResponseDto, { isArray: true, isPaginate: true })
  @Get()
  findAll(@Query() query?: QueryPaginationDto): Promise<PaginateOutput<UsersPublic>> {
    return this.usersService.findAllUser(query);
  }

  @ApiSuccessResponse(UserResponseDto)
  @Get('/:id')
  findOne(@Param('id') id: string, @Body() omitPassword: { password: boolean }) {
    return this.usersService.findUser(id, omitPassword);
  }

  @ApiSuccessResponse(UserResponseDto)
  @Post()
  createUser(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.createUser(createUsersDto);
  }

  @ApiSuccessResponse(UserResponseDto)
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() updateUsersDto: UpdateUsersDto) {
    return this.usersService.updateUser(id, updateUsersDto);
  }

  @ApiResponse({ example: null })
  @HttpCode(204)
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
