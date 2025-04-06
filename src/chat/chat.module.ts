import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SessionsService } from './sessions.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  providers: [MessagesService, SessionsService, ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
