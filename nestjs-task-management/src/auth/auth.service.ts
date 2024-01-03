import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { User } from './user.entity';
import { UserRepository } from './users.repository';
import { bcryptCompare } from './utils/auth.bcrypt';

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

    const matchPassword = await bcryptCompare(password, user.password);

    if (user && matchPassword) {
      return 'success'
    }

    throw new UnauthorizedException('Please check your credentials');
  }
}


