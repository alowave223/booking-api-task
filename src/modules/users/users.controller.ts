import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Booking, Role, User } from '@prisma/client';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id/bookings')
  @ApiResponse({ status: 200, description: 'User bookings' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiBearerAuth('Authorization')
  async getUserBookings(@Request() request, @Param('id') id: number) {
    if (request.user.id !== id && request.user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );
    }

    const user = (await this.usersService.findOne(
      { id },
      { bookings: true },
    )) as User & { bookings: Booking[] };

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.bookings;
  }
}
