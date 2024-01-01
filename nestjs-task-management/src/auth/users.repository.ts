import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dtos/auth-credentials.dto";
import { User } from "./user.entity";


@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }


  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    const query = this.createQueryBuilder('user');

    if (username) {
      query.andWhere('user.username = :username', { username: username });
      throw new BadRequestException(`User with this username "${username}" already exists`);
    }

    const user = this.create({
      username,
      password
    })

    await this.save(user);
    return user;
  }
}