import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { UpdateAuthDto } from './dtos/update-auth.dto';
import { SignInAuthDto } from './dtos/login-auth.dto';
import { UpdateAuthUserResponse } from './interfaces/update-authuser-responser.interface';
import { AuthResponse } from './interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(body: RegisterAuthDto): Promise<AuthResponse> {
    const authData = await this.authRepository.register(
      body.email,
      body.password,
    );
    return authData;
  }

  async login(authDto: SignInAuthDto): Promise<AuthResponse> {
    const authData = await this.authRepository.login(
      authDto.email,
      authDto.password,
    );
    return authData;
  }

  async update(updateAuthDto: UpdateAuthDto): Promise<UpdateAuthUserResponse> {
    const data = await this.authRepository.updateUser(updateAuthDto);
    return data;
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.authRepository.deleteUser(id);
  }
}
