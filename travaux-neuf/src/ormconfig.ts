import { ConnectionOptions } from 'typeorm';

// export const config: ConnectionOptions = {
//       type: 'mysql',
//       host: 'localhost',
//       port: 3388,
//       username: 'root',
//       password: '',
//       database: 'itemisation',
//       entities: ["dist/**/*.entity{.ts,.js}"],
//       synchronize: true,
// }

export const config: ConnectionOptions = {
      type: 'mssql',
      host: '172.16.208.186',
      username: 'TN',
      password: 'TN',
      database: 'TravauxNeufs',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
      options: {
            encrypt: false 
      }
}