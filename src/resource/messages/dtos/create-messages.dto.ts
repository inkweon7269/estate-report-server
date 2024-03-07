import { PickType } from '@nestjs/swagger';
import { MessagesEntity } from '@root/entities/messages.entity';
import { IsNumber } from 'class-validator';

export class CreateMessagesDto extends PickType(MessagesEntity, ['message']) {
    @IsNumber()
    chatId: number;
}
