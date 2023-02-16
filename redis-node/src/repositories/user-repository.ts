import { User } from "src/entities/user";

export abstract class UserRepository {
  abstract findMany(): Promise<User[]>;
}