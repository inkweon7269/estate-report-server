import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from '@root/resource/chats/chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsEntity } from '@root/entities/chats.entity';
import { CommonModule } from '@root/common/common.module';
import { MessagesEntity } from '@root/entities/messages.entity';
import { MessagesService } from '@root/resource/messages/messages.service';
import { MessagesController } from '@root/resource/messages/messages.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ChatsEntity, MessagesEntity]), CommonModule],
    controllers: [ChatsController, MessagesController],
    providers: [ChatsGateway, ChatsService, MessagesService],
})
export class ChatsModule {}
