import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { JwtPayload } from './dtos/jwt-payload.dto';
import { User } from './user.entity';
import { UserRepository } from './users.repository';
import { bcryptCompare } from './utils/auth.bcrypt';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository, private jwtService: JwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<Record<string, string>> {
    const { username, password } = authCredentialsDto;

    const user = await this.userRepository.findOneBy({ username });

    const matchPassword = await bcryptCompare(password, user.password);

    const payload: JwtPayload = { username }

    if (user && matchPassword) {
      const accessToken = await this.jwtService.signAsync(payload)
      return {
        accessToken
      };
    }

    throw new UnauthorizedException('Please check your credentials');
  }
}


