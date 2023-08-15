import { Injectable } from '@nestjs/common';
import { User } from './entities/user';
import { UserRepository } from './repositories/user-repository';

@Injectable()
export class AppService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.findMany();
    return users;
  }
}
