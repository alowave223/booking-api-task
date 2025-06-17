import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Role } from '@prisma/client';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createBookingDto: CreateBookingDto, @Request() request) {
    return this.bookingsService.create({
      ...createBookingDto,
      user: {
        connect: {
          id: request.user.id,
        },
      },
      room: {
        connect: {
          id: createBookingDto.roomId,
        },
      },
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiResponse({ status: 200, description: 'List of bookings' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Request() request) {
    if (request.user.role === Role.ADMIN) {
      return this.bookingsService.findMany({});
    }

    return this.bookingsService.findMany({
      where: {
        userId: request.user.id,
      },
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiParam({ name: 'id', description: 'Booking ID', type: Number })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async remove(@Param('id') id: number, @Request() request) {
    const booking = await this.bookingsService.findOne({ id });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (
      booking.userId !== request.user.id &&
      request.user.role !== Role.ADMIN
    ) {
      throw new ForbiddenException(
        'You are not allowed to delete this booking',
      );
    }

    return this.bookingsService.delete({ id });
  }
}
