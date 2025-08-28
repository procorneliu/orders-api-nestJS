import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum OrderStatus {
  CREATED = 'CREATED',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  PAID = 'PAID',
  FULFILLED = 'FULFILLED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
}

export class CreateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsString()
  deliveryLocation: string;
}
