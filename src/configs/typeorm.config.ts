import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function TypeormConfig(configService: ConfigService) {
    const env = configService.get('NODE_ENV');
    if (!['dev', 'prod'].includes(env)) {
        throw Error('반드시 dev, prod 중 하나의 환경에 속해야 합니다.');
    }

    const synchronize = configService.get<string>('SYNCHRONIZE') === 'true' ? true : false;
    const logging = configService.get<string>('DB_LOGGING') === 'true' ? true : false;
    const DB_TYPE: 'postgres' | null = 'postgres';

    const option: TypeOrmModuleOptions = {
        type: DB_TYPE, // DB 종류
        host: configService.get(`DB_HOST`), // HOST 정보
        port: +configService.get<number>(`DB_PORT`), // PORT 정보
        username: configService.get(`DB_USERNAME`), // DB 아이디
        password: configService.get(`DB_PASSWORD`), // DB 비밀번호
        database: configService.get(`DB_DATABASE`), // 데이터베이스명
        autoLoadEntities: true, // 프로젝트 내에 있는 entity를 자동으로 스캔해서 사용할지 설정
        synchronize: env === 'prod' ? false : synchronize, // DB 동기화 설정
        useUTC: false, // 현지 시간대(Local Timezone)가 아닌 협정 세계시(UTC) 기준으로 사용할지 여부를 결정
        logging: logging, // 로그 정보를 출력할지 설정
        retryAttempts: env === 'prod' ? 10 : 1, // DB 연결 시도 횟수
    };

    return option;
}
