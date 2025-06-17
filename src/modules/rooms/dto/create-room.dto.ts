import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Room name', example: 'Deluxe Suite' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Room capacity', example: 4, minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  capacity: number;
} 