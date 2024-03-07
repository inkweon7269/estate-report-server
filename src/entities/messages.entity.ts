import { CommonEntity } from '@root/common/entities/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ChatsEntity } from '@root/entities/chats.entity';
import { UserEntity } from '@root/entities/user.entity';
import { IsString } from 'class-validator';

@Entity('messages')
export class MessagesEntity extends CommonEntity {
    @ManyToOne(() => ChatsEntity, (chat) => chat.messages)
    chat: ChatsEntity;

    @ManyToOne(() => UserEntity, (user) => user.messages)
    author: UserEntity;

    @Column()
    @IsString()
    message: string;
}
