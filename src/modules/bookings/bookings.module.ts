import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [BookingsService, PrismaService],
  exports: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}