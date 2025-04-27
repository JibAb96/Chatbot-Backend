import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.services';
import { AuthService } from './auth.service';
import { LogInAuthDto } from './dtos/login-auth.dto';
import { UpdateAuthDto } from './dtos/update-auth.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { RegisterDto } from './dtos/registration.dto';
import { AuthDataDto } from './dtos/authdata.dto';
import { UserDataDto } from './dtos/userdata.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';

@Injectable()
export class UserFacadeService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  private readonly logger = new Logger(UserFacadeService.name);

  async register(body: RegisterDto): Promise<AuthDataDto> {
    let authData: AuthResponse | null = null;
    let profileCreated = false;

    try {
      authData = await this.authService.register({
        email: body.email,
        password: body.password,
      });

      if (!authData?.id) {
        this.logger.error('Auth registration failed to return a user ID');
        throw new InternalServerErrorException(
          'Registration failed due to an internal error',
        );
      }

      const data = await this.usersService.create({
        id: authData.id,
        username: body.username,
      });
      profileCreated = true;
      return {
        ...authData,
        username: data,
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);

      try {
        if (authData?.id && !profileCreated) {
          await this.authService.deleteUser(authData.id);
          this.logger.log(
            `Rolled back auth user ${authData.id} after failed registration`,
          );
        }
      } catch (rollbackError) {
        this.logger.error(`Rollback failed: ${rollbackError.message}`);
      }

      if (error.message?.includes('duplicate key')) {
        throw new ConflictException('User with this email already exists');
      }

      throw new InternalServerErrorException(
        'Registration failed due to an internal error',
      );
    }
  }

  async login(authDto: LogInAuthDto): Promise<AuthDataDto> {
    const authData = await this.authService.login({
      email: authDto.email,
      password: authDto.password,
    });
    try {
      const userData = await this.usersService.findOneById(authData.id);
      return {
        id: authData.id,
        email: authData.email,
        username: userData.username,
        token: authData.token,
        refreshToken: authData.refreshToken,
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);

      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      if (error.message?.includes('Database error')) {
        throw new InternalServerErrorException(
          'Authentication service unavailable',
        );
      }
      throw new InternalServerErrorException(
        'There was an internal server error while logging user in ',
      );
    }
  }

  async updateAuth(
    userId: string,
    updateData: UpdateAuthDto,
    requestUser: any,
  ): Promise<UserDataDto> {
    try {
      this.ensureSameUser(userId, requestUser);
      const updatedUser = await this.authService.update(updateData);
      try {
        const findUser = await this.usersService.findOneById(updatedUser.id);
        return {
          id: updatedUser.id,
          username: findUser.username,
          email: updateData.email,
        };
      } catch (error) {
        this.logger.error(
          `Updated auth table successfully but finding user failed: ${error.message}`,
          error.stack,
        );
        if (error instanceof NotFoundException) {
          throw error;
        }
      }
    } catch (error) {
      this.logger.error(`Updating user failed: ${error.message}`, error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'There was internal server error updating user ',
      );
    }
    throw new InternalServerErrorException(
      'There was internal server error updating user ',
    );
  }

  async updateUser(
    userId: string,
    updateData: UpdateUserDto,
    requestUser: any,
  ): Promise<UserResponseDto> {
    this.ensureSameUser(userId, requestUser);
    const update = this.usersService.update(userId, updateData);
    return update;
  }

  async deleteUser(
    userId: string,
    requestUser: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      this.ensureSameUser(userId, requestUser);
      await this.authService.deleteUser(userId);
      return {
        success: true,
        message: 'Account successfully deleted',
      };
    } catch (error) {
      this.logger.error(`Deleting user failed: ${error.message}`, error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'There was an internal server error deleting user',
      );
    }
  }

  private ensureSameUser(userId: string, requestUser: string) {
    if (userId !== requestUser) {
      throw new ForbiddenException(
        'You can only access your own account information',
      );
    }
  }
}
