import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { User } from './user.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) { }


  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.createUser(authCredentialsDto);
  }
}


