import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesEntity } from '@root/entities/messages.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CommonService } from '@root/common/common.service';
import { BasePaginationDto } from '@root/common/dtos/base-pagination.dto';
import { CreateMessagesDto } from '@root/resource/messages/dtos/create-messages.dto';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(MessagesEntity)
        private readonly messageRepo: Repository<MessagesEntity>,
        private readonly commonService: CommonService,
    ) {}

    async createMessage(dto: CreateMessagesDto, authorId: number) {
        const message = await this.messageRepo.save({
            chat: {
                id: dto.chatId,
            },
            author: {
                id: authorId,
            },
            message: dto.message,
        });

        return this.messageRepo.findOne({
            where: {
                id: message.id,
            },
            relations: {
                chat: true,
            },
        });
    }

    paginateMessages(dto: BasePaginationDto, overrideFindOptions: FindManyOptions<MessagesEntity>) {
        return this.commonService.paginate(dto, this.messageRepo, overrideFindOptions, 'messages');
    }
}
