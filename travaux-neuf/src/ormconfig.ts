import { ConnectionOptions } from 'typeorm';

export const config: ConnectionOptions = {
      type: 'mysql',
      host: 'localhost',
      port: 3388,
      username: 'root',
      password: '',
      database: 'itemisation',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
}