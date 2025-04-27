import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username of the user',
    required: true,
  })
  username: string;
}
