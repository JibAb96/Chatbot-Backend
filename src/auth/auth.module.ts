import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseModule } from "src/supabase/supabase.module";
import { AuthRepository } from "./auth.repository";
import { UsersService } from "./users.services";
import { UsersRepository } from "./users.repository";
import { UserFacadeService } from './user-facade.service';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, UsersService, UsersRepository, UserFacadeService]
})
export class AuthModule {}
