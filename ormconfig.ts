module.exports = {
  type: 'postgres',
  host: 'ec2-3-229-165-146.compute-1.amazonaws.com',
  port: 5432,
  url: process.env.DATABASE_URL,
  synchronize: true,
  ssl: { rejectUnauthorized: false },
  logging: false,
  entities: ['./dist/**/*.entity.js'],
  migrations: ['./dist/src/migration/**/*.js'],
};
