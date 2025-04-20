import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { UpdateUserDto } from "./dtos/update-user.dto";
import { CreateUserInterface } from "./interfaces/create-user.interface";

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  async findOneById(id: string) {
    const user = await this.userRepository.findOneById(id);
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneByEmail(email);
    return user;
  }

  async create(data: CreateUserInterface): Promise<string> {
    const userData = await this.userRepository.create(data);
    return userData
  }

  async update(id: string, userData: UpdateUserDto): Promise<any> {
    const findUser = await this.userRepository.findOneById(id);
    if (!findUser) {
      throw new NotFoundException('User to be updated does not exist');
    }
    const updatedUser = await this.userRepository.update(id, userData);
    return updatedUser.user.username;
  }

  async delete(id: string): Promise<boolean> {
    const findUser = await this.userRepository.findOneById(id);
    if (!findUser) {
      throw new NotFoundException('User to be deleted does not exist');
    }
    return await this.userRepository.delete(id);
  }
}
