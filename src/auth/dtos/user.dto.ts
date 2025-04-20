import { Expose } from 'class-transformer';
import { MaxLength, MinLength } from 'class-validator';

export class UserDto {
  @MinLength(2)
  @MaxLength(50)
  username: string;
}
