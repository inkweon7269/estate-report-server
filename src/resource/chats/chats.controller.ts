import { Controller, Get, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { PaginateChatDto } from '@root/resource/chats/dtos/paginate-chat.dto';

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {}

    @Get()
    paginateChats(@Query() dto: PaginateChatDto) {
        return this.chatsService.paginateChats(dto);
    }
}
