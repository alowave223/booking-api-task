import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Booking, Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    bookingWhereUniqueInput: Prisma.BookingWhereUniqueInput,
    bookingInclude?: Prisma.BookingInclude,
  ): Promise<Booking | null> {
    return this.prisma.booking.findUnique({
      where: bookingWhereUniqueInput,
      include: bookingInclude,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BookingWhereUniqueInput;
    where?: Prisma.BookingWhereInput;
    orderBy?: Prisma.BookingOrderByWithRelationInput;
    include?: Prisma.BookingInclude;
  }): Promise<Booking[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.booking.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async create(bookingData: Prisma.BookingCreateInput): Promise<Booking> {
    return this.prisma.$transaction(async (tx) => {
      const room = await tx.room.findUnique({
        where: {
          id: bookingData.room.connect?.id,
        },
        include: { bookings: true },
      });

      if (!room) throw new NotFoundException('Room not found');

      if (room.capacity < room.bookings.length + 1)
        throw new BadRequestException('Room capacity is not enough');

      if (
        room.bookings.some(
          (booking) =>
            booking.checkIn <= bookingData.checkOut &&
            booking.checkOut >= bookingData.checkIn,
        )
      )
        throw new BadRequestException('Booking conflict');

      return tx.booking.create({
        data: {
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          user: {
            connect: {
              id: bookingData.user.connect?.id,
            },
          },
          room: {
            connect: {
              id: bookingData.room.connect?.id,
            },
          },
        },
      });
    });
  }

  async update(params: {
    where: Prisma.BookingWhereUniqueInput;
    data: Prisma.BookingUpdateInput;
  }): Promise<Booking> {
    const { where, data } = params;
    return this.prisma.booking.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.BookingWhereUniqueInput): Promise<Booking> {
    return this.prisma.booking.delete({ where });
  }
}
