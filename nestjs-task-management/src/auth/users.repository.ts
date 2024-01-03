import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { DataSource, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dtos/auth-credentials.dto";
import { User } from "./user.entity";


@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    try {
      const { username, password } = authCredentialsDto;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt)

      const user = this.create({
        username,
        password: hashedPassword
      })

      await this.save(user);
      return user;

    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException("Username already in use")
      }
      throw new InternalServerErrorException();
    }
  }
}