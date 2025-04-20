import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];
    const refreshToken = request.headers['x-refresh-token'];
    try {
      const { data, error } =
        await this.supabaseService.client.auth.getUser(token);
      if (error || !data.user) {
        throw new UnauthorizedException('Invalid token');
      }
      await this.supabaseService.client.auth.setSession({
        access_token: token,
        refresh_token: refreshToken,
      });
      request.user = data.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
