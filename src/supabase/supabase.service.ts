import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabaseClient: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.supabaseClient = createClient(
      this.configService.get<string>('SUPABASE_URL') || '',
      this.configService.get<string>('SUPABASE_SERVICE_KEY') || '',
      {
        auth: {
          persistSession: false,
        },
      },
    );
  }
  get client(): SupabaseClient {
    return this.supabaseClient;
  }
}
