import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsEntity } from '@root/entities/chats.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from '@root/resource/chats/dtos/create-chat.dto';
import { CommonService } from '@root/common/common.service';
import { PaginateChatDto } from '@root/resource/chats/dtos/paginate-chat.dto';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(ChatsEntity)
        private readonly chatsRepo: Repository<ChatsEntity>,
        private readonly commonService: CommonService,
    ) {}

    paginateChats(dto: PaginateChatDto) {
        return this.commonService.paginate(
            dto,
            this.chatsRepo,
            {
                relations: {
                    users: true,
                },
            },
            'chats',
        );
    }

    async createChat(dto: CreateChatDto) {
        const chat = await this.chatsRepo.save({
            // 1, 2, 3
            // [{id: 1}, {id: 2}, {id: 3}]
            users: dto.userIds.map((id) => ({ id })),
        });

        return this.chatsRepo.findOne({
            where: {
                id: chat.id,
            },
        });
    }

    async checkIfChatExists(chatId: number) {
        const exists = await this.chatsRepo.exist({
            where: {
                id: chatId,
            },
        });

        return exists;
    }
}
