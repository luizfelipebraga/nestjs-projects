import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { User } from './user.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    const user = await this.userRepository.findOneBy({ username });

    // const passwordsCompared = await bcryptCompare(user.password, password);

    if (user && (await bcrypt.compare(user.password, password))) {
      return 'success'
    }

    // if (user && passwordsCompared) {
    //   return 'success'
    // }

    throw new UnauthorizedException('Please check your credentials');
  }
}


