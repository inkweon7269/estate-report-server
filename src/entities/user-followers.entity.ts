import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { UserEntity } from '@root/entities/user.entity';
@Entity({ name: 'user_followers' })
export class UserFollowersEntity extends CommonEntity {
    @ManyToOne(() => UserEntity, (user) => user.followers)
    follower: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.followees)
    followee: UserEntity;

    @Column({
        default: false,
    })
    isConfirmed: boolean;
}
