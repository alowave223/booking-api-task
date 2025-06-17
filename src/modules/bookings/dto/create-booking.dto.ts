import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'Room ID', example: 1 })
  @IsNumber()
  roomId: number;

  @ApiProperty({ description: 'Check-in date', example: '2024-01-15T10:00:00Z' })
  @IsDateString()
  checkIn: string;

  @ApiProperty({ description: 'Check-out date', example: '2024-01-17T10:00:00Z' })
  @IsDateString()
  checkOut: string;
} 