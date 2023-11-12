import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    // 생성일
    @CreateDateColumn({ type: 'timestamp without time zone' })
    createAt: Date;

    // 업데이트일
    @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
    updateAt: Date;

    // 삭제일
    @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
    deleteAt: Date;
}
