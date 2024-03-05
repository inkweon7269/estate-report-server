import { Entity, ManyToMany } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { UserEntity } from '@root/entities/user.entity';

@Entity('chats')
export class ChatsEntity extends CommonEntity {
    @ManyToMany(() => UserEntity, (user) => user.chats)
    users: UserEntity[];
}
