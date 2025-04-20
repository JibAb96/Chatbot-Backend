import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { AuthResponse } from './interfaces/auth-response.interface';
import { UpdateAuthUserResponse } from './interfaces/update-authuser-responser.interface';
import { UpdateAuthDto } from './dtos/update-auth.dto';

@Injectable()
export class AuthRepository {
  constructor(private supabaseService: SupabaseService) {}
  private readonly logger = new Logger(AuthRepository.name);

  async register(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
    });
    if (error) {
      this.logger.error(
        `Unable to register user to supabase auth: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'There was an internal server error registering user',
      );
    }
    if (data.user && data.session && data.user.email) {
      return {
        id: data.user.id,
        email: data.user.email,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
    } this.logger.error(
      "Unable to register user to supabase auth: Missing data object missing user or session properties",
    );
    throw new InternalServerErrorException(
      'There was an internal server error registering user',
    );
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data, error } =
      await this.supabaseService.client.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      this.logger.error(
        `Unable to login user: ${error.message}`,
        error.stack,
      );
      if (error.message === 'Invalid login credentials') {
        throw new UnauthorizedException({
          message: 'Invalid username or password',
          error: 'Unauthorized access',
        });
      }
        throw new InternalServerErrorException(
          'There was an internal server error logging in user',
        );
    }
      return {
        id: data.user.id,
        email: data.user.email,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
    
  }

  async updateUser(
    updateAuthDto: UpdateAuthDto,
  ): Promise<UpdateAuthUserResponse> {
    const { data, error } =
      await this.supabaseService.client.auth.updateUser(updateAuthDto);
    if (error) {
      this.logger.error(
        `Unable to update user with supabase auth: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'There was an internal server error updating user',
      );
    }
    if (data.user.email) {
      return {
        id: data.user.id,
        email: data.user.email,
      };
    }
    throw new InternalServerErrorException(
      'There was an internal server error updating user',
    );
  }

  async deleteUser(id: string): Promise<boolean> {
    const { error } =
      await this.supabaseService.client.auth.admin.deleteUser(id);
    if (error) {
      this.logger.error(
        `Unable to delete user with supabase auth: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'There was an internal server error deleting user',
      );
    }
    console.log(error)
    return true
  }

}
