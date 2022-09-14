export default {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'vcp-database',
  synchronize: true,
  logging: false,
  entities: ['./dist/**/*.entity.js'],
};
