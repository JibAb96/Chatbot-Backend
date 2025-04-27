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
import { LogInAuthDto } from './dtos/login-auth.dto';
import { RegisterDto } from './dtos/registration.dto';
import { UserFacadeService } from './user-facade.service';
import { ApiResponseDto } from './dtos/api-response.dto';
import { AuthDataDto } from './dtos/authdata.dto';
import { SupabaseUser } from './interfaces/auth-request.interface';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDataDto } from './dtos/userdata.dto';
import { UserDto } from './dtos/user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UserResponseDto } from './dtos/user-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly usersFacade: UserFacadeService) {}

  @Post('/register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with email and password',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration information including email and password',
  })
  @SwaggerResponse({
    status: 201,
    description: 'User successfully registered',
    type: ApiResponseDto<AuthDataDto>,
  })
  @SwaggerResponse({
    status: 400,
    description: 'Invalid input or email already in use',
  })
  async register(
    @Body() body: RegisterDto,
  ): Promise<ApiResponseDto<AuthDataDto>> {
    const user = await this.usersFacade.register(body);

    return {
      status: 'success',
      data: user,
      message: 'User registered successfully',
    };
  }

  @Post('/login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user and returns a JWT token',
  })
  @ApiBody({
    type: LogInAuthDto,
    description: 'User login credentials',
  })
  @SwaggerResponse({
    status: 200,
    description: 'User success',
  })
  @SwaggerResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
    @Body() body: LogInAuthDto,
  ): Promise<ApiResponseDto<AuthDataDto>> {
    const user = await this.usersFacade.login(body);

    return {
      status: 'success',
      data: user,
      message: 'User logged in successfully',
    };
  }

  @UseGuards(SupabaseAuthGuard)
  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user account',
    description:
      'Deletes a user account by ID. User must be authenticated and can only delete their own account or have admin privileges.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID to delete',
    type: String,
  })
  @SwaggerResponse({
    status: 200,
    description: 'User successfully deleted',
    type: ApiResponseDto<{ success: boolean; message: string }>,
  })
  @SwaggerResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @SwaggerResponse({
    status: 403,
    description: 'Forbidden - cannot delete other users',
  })
  @SwaggerResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() currentUser: SupabaseUser,
  ): Promise<ApiResponseDto<{ success: boolean; message: string }>> {
    const response = await this.usersFacade.deleteUser(id, currentUser.id);
    return {
      status: 'success',
      data: response,
      message: 'User removed successfully',
    };
  }

  @UseGuards(SupabaseAuthGuard)
  @Patch('/update-auth/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user authentication info',
    description:
      "Updates a user's authentication information such as email or password. User must be authenticated and can only update their own information.",
  })
  @ApiParam({
    name: 'id',
    description: 'User ID to update',
    type: String,
  })
  @ApiBody({
    type: UpdateAuthDto,
    description: 'Updated authentication information',
  })
  @SwaggerResponse({
    status: 200,
    description: 'User authentication information successfully updated',
    type: ApiResponseDto<UserDataDto>,
  })
  @SwaggerResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @SwaggerResponse({
    status: 403,
    description: 'Forbidden - cannot update other users',
  })
  @SwaggerResponse({
    status: 404,
    description: 'User not found',
  })
  async updateAuth(
    @Param('id') id: string,
    @Body() body: UpdateAuthDto,
    @CurrentUser() currentUser: SupabaseUser,
  ): Promise<ApiResponseDto<UserDataDto>> {
    const user = await this.usersFacade.updateAuth(id, body, currentUser.id);
    return {
      status: 'success',
      data: user,
      message: 'User updated successfully',
    };
  }

  @UseGuards(SupabaseAuthGuard)
  @Patch('/update-user/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user profile',
    description:
      "Updates a user's profile information such as name, profile picture, etc. User must be authenticated and can only update their own profile.",
  })
  @ApiParam({
    name: 'id',
    description: 'User ID to update',
    type: String,
  })
  @ApiBody({
    type: UserDto,
    description: 'Updated user profile information',
  })
  @SwaggerResponse({
    status: 200,
    description: 'User profile successfully updated',
    type: ApiResponseDto<UserResponseDto>,
  })
  @SwaggerResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @SwaggerResponse({
    status: 403,
    description: 'Forbidden - cannot update other users',
  })
  @SwaggerResponse({
    status: 404,
    description: 'User not found',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() body: UserDto,
    @CurrentUser() currentUser: SupabaseUser,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.usersFacade.updateUser(id, body, currentUser.id);
    return {
      status: 'success',
      data: user,
      message: 'User updated successfully',
    };
  }
}
