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

// export const config: ConnectionOptions = {
//       type: 'mssql',
//       host: '172.16.208.186',
//       username: 'TN',
//       password: 'TN',
//       database: 'TravauxNeufs',
//       entities: ["dist/**/*.entity{.ts,.js}"],
//       synchronize: true,
//       options: {
//             encrypt: false 
//       }
// }

export const config: ConnectionOptions = {
      type: 'postgres',
      host: 'localhost',
      username: 'tn',
      port : 5432,
      password: 'G4_Vu2=B1',
      database: 'travauxneufs',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
}