import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma';
import { RedisService } from 'src/config/redis';
import { User } from 'src/entities/user';
import { PrismaUserRepository } from '../prisma/prisma-user-repository';
import { UserRepository } from '../user-repository';

@Injectable()
export class RedisUserRepository implements UserRepository {
  constructor(
    private readonly redis: RedisService,
    private readonly prismaUserRepository: PrismaUserRepository,
  ) {}

  async findMany(): Promise<User[]> {
    const cachedUsers = await this.redis.get('users');

    if (!cachedUsers) {
      const users = await this.prismaUserRepository.findMany();

      await this.redis.set('users', JSON.stringify(users), 'EX', 15);
      console.log('\x1b[36m%s\x1b[0m', 'From Database');

      return users;
    }

    console.log('\x1b[36m%s\x1b[0m', 'From Cache');

    return JSON.parse(cachedUsers);
  }
}
