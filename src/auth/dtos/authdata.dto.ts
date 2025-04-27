import { ApiProperty } from '@nestjs/swagger';

export class AuthDataDto {
  @ApiProperty({
    example: '6605e9e83615f43b9a72c301',
    description: 'Unique user identifier',
  })
  id: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username',
  })
  username: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  token: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token for getting new access tokens',
  })
  refreshToken: string;
}
