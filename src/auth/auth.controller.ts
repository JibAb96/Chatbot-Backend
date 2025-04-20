import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { UpdateAuthDto } from './dtos/update-auth.dto';
import { SignInAuthDto } from './dtos/login-auth.dto';
import { RegisterDto } from './dtos/registration.dto';
import { UserFacadeService } from './user-facade.service';
import { ApiResponse } from "./interfaces/api-response.interface";
import { ApiDataAuthInterface } from "./interfaces/api-authdata.interface";
import { SupabaseUser } from "./interfaces/auth-request.interface";
import { CurrentUser } from "./decorators/current-user.decorator";
import { ApiUserDataInterface } from "./interfaces/api-userdata.interface";
import { UserDto } from "./dtos/user.dto";
import { UserResponse } from "./interfaces/user-response.interface";

@Controller('auth')
export class AuthController {
  constructor(private readonly usersFacade: UserFacadeService) {}

  @Post('/register')
  async register(
    @Body() body: RegisterDto,
  ): Promise<ApiResponse<ApiDataAuthInterface>> {
    const user = await this.usersFacade.register(body);

    return {
      status: 'success',
      data: user,
      message: 'User registered successfully',
    };
  }

  @Post('/login')
  async login(
    @Body() body: SignInAuthDto,
  ): Promise<ApiResponse<ApiDataAuthInterface>> {
    const user = await this.usersFacade.login(body);

    return {
      status: 'success',
      data: user,
      message: 'User logged in successfully',
    };
  }

  @UseGuards(SupabaseAuthGuard)
  @Delete('/:id')
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() currentUser: SupabaseUser,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    const response = await this.usersFacade.deleteUser(id, currentUser.id);
    return {
      status: 'success',
      data: response,
      message: 'User removed successfully',
    };
  }

  @UseGuards(SupabaseAuthGuard)
  @Patch('/update-auth/:id')
  async updateAuth(
    @Param('id') id: string,
    @Body() body: UpdateAuthDto,
    @CurrentUser() currentUser: SupabaseUser,
  ): Promise<ApiResponse<ApiUserDataInterface>> {
    const user = await this.usersFacade.updateAuth(id, body, currentUser.id);
    return {
      status: 'success',
      data: user,
      message: 'User updated successfully',
    };
  }

  @UseGuards(SupabaseAuthGuard)
  @Patch('/update-user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UserDto,
    @CurrentUser() currentUser: SupabaseUser,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.usersFacade.updateUser(id, body, currentUser.id);
    return {
      status: 'success',
      data: user,
      message: 'User updated successfully',
    };
  }
}
