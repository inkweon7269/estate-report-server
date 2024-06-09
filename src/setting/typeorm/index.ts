import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function setTypeOrmConfig() {
    const env = process.env.DOPPLER_CONFIG;
    if (!['dev', 'prod'].includes(env)) {
        throw Error('반드시 dev, prod 중 하나의 환경에 속해야 합니다.');
    }

    const synchronize = process.env.SYNCHRONIZE === 'true' ? true : false;
    const logging = process.env.DB_LOGGING === 'true' ? true : false;
    const DB_TYPE: 'postgres' | null = 'postgres';

    const option: TypeOrmModuleOptions = {
        type: DB_TYPE,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        // entities: [__dirname + '/../**/*.entity.{js,ts}'],
        autoLoadEntities: true, // 프로젝트 내에 있는 entity를 자동으로 스캔해서 사용할지 설정
        synchronize: env === 'prod' ? false : synchronize,
        useUTC: false,
        logging: logging,
        retryAttempts: env === 'prod' ? 10 : 1,
    };

    return option;
}
