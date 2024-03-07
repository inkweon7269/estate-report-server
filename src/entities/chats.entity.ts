import { Entity, ManyToMany, OneToMany } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { UserEntity } from '@root/entities/user.entity';
import { MessagesEntity } from '@root/entities/messages.entity';

@Entity('chats')
export class ChatsEntity extends CommonEntity {
    @ManyToMany(() => UserEntity, (user) => user.chats)
    users: UserEntity[];

    @OneToMany(() => MessagesEntity, (message) => message.chat)
    messages: MessagesEntity[];
}
