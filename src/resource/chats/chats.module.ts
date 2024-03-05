import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from '@root/resource/chats/chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsEntity } from '@root/entities/chats.entity';
import { CommonModule } from '@root/common/common.module';

@Module({
    imports: [TypeOrmModule.forFeature([ChatsEntity]), CommonModule],
    controllers: [ChatsController],
    providers: [ChatsGateway, ChatsService],
})
export class ChatsModule {}
