import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [RoomsService, PrismaService],
  exports: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}