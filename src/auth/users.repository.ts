import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PostgrestError } from '@supabase/supabase-js';
import { UserResponse } from './interfaces/user-response.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserInterface } from "./interfaces/create-user.interface";

@Injectable()
export class UsersRepository {
  constructor(private supabaseService: SupabaseService) {}
  private readonly logger = new Logger(UsersRepository.name);

  async findOneById(id: string): Promise<UserResponse> {
    const { data, error } = await this.supabaseService.client
      .from('user_profile')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      this.logger.error(
        `Unable to find user by id: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'There was an internal server error finding user',
      );
    }
    return data
  }

  async findOneByEmail(email: string): Promise<UserResponse> {
    const { data, error } = await this.supabaseService.client
      .from('user_profile')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      this.logger.error(
        `Unable to find user by email: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'There was an internal server error creating user',
      );
    }
    return data;
  }

  async create(userData: CreateUserInterface): Promise<string> {
    try {
      const { data, error } = await this.supabaseService.client
        .from('user_profile')
        .insert(userData)
        .select()
        .single();

      if (error) {
        this.logger.error(
          `Unable to create user: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException(
          'There was an internal server error creating user',
        );
      }
      return data.username
    } catch (error) {
      this.logger.error(`Unable to create user: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'There was an internal server error creating user',
      );
    }
  }

  async update(id: string, userData: UpdateUserDto): Promise<any> {
    const { data, error } = await this.supabaseService.client
      .from('user_profile')
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error(`Unable to update user: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'There was an internal server error updating user',
      );
    }
    return data
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabaseService.client
      .from('user_profile')
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error(`Unable to delete user: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'There was an internal server error updating user',
      );
    }
    return true;
  }
}
