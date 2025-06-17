import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Room, Prisma } from '@prisma/client';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    roomWhereUniqueInput: Prisma.RoomWhereUniqueInput,
    roomInclude?: Prisma.RoomInclude,
  ): Promise<Room | null> {
    return this.prisma.room.findUnique({
      where: roomWhereUniqueInput,
      include: roomInclude,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoomWhereUniqueInput;
    where?: Prisma.RoomWhereInput;
    orderBy?: Prisma.RoomOrderByWithRelationInput;
    include?: Prisma.RoomInclude;
  }): Promise<Room[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.room.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async create(roomData: Prisma.RoomCreateInput): Promise<Room> {
    return this.prisma.room.create({
      data: {
        name: roomData.name,
        capacity: roomData.capacity,
        owner: {
          connect: {
            id: roomData.owner.connect?.id,
          },
        },
      },
    });
  }

  async update(params: {
    where: Prisma.RoomWhereUniqueInput;
    data: Prisma.RoomUpdateInput;
  }): Promise<Room> {
    const { where, data } = params;
    return this.prisma.room.update({ where, data });
  }

  async delete(where: Prisma.RoomWhereUniqueInput): Promise<Room> {
    return this.prisma.room.delete({ where });
  }
}