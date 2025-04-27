import { ApiProperty } from '@nestjs/swagger';

export class UserDataDto {
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
}
