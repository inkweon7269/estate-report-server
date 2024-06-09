import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp without time zone' })
    createdAt: Date;
}

export class CommonWithUpdateAndDeleteEntity extends CommonEntity {
    @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
    updatedAt?: Date;

    @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
    deletedAt?: Date;
}
