import { Expose } from 'class-transformer';
import { MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: "User's username",
    example: 'johndoe',
    minLength: 2,
    maxLength: 50,
    required: true,
  })
  @MinLength(2)
  @MaxLength(50)
  username: string;
}
