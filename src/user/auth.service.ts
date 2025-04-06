import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from "./user.service";
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from "./dtos/create-user.dto";

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(formData: CreateUserDto) {
    //see if email is in use
    const users = await this.usersService.find(formData.email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    //hash the users password
    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(formData.password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');
    formData.password = result;
    //Create a new user and save it
    const user = await this.usersService.create(formData);
    //return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
