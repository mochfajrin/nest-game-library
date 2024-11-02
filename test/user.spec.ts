import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestModule } from './test.module';
import { TestService } from './test.service';
import { GameModule } from 'src/game/game.module';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/v1/users', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          username: '',
          name: '',
          password: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    it('should be rejected if username already exist', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          username: 'test',
          name: 'test',
          password: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    it('should be to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          username: 'test',
          name: 'test',
          password: 'test7',
        });

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });
  });
  describe('POST /api/v1/users/login', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: '',
          password: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    it('should be rejected if username is invalid', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: 'test1',
          password: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
    it('should be rejected if password is invalid', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          password: 'test1',
        });

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
    it('should be to register', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.access_token).toBeDefined();
    });
  });
  describe('GET /api/v1/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });
    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users/current')
        .set('Authorization', `Bearer wrong`);

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be to register', async () => {
      const user = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      const response = await request(app.getHttpServer())
        .get('/api/v1/users/current')
        .set('Authorization', `Bearer ${user.body.data.access_token}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });
  });
  describe('PATCH /api/v1/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });
    it('should be rejected if request is invalid', async () => {
      const user = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      const response = await request(app.getHttpServer())
        .patch('/api/v1/users/current')
        .set('Authorization', `Bearer ${user.body.data.access_token}`)
        .send({
          name: '',
          password: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    it('should be able update username', async () => {
      const user = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      const response = await request(app.getHttpServer())
        .patch('/api/v1/users/current')
        .set('Authorization', `Bearer ${user.body.data.access_token}`)
        .send({
          name: 'test123',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test123');
    });
    it('should be able update password', async () => {
      let user = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      const response = await request(app.getHttpServer())
        .patch('/api/v1/users/current')
        .set('Authorization', `Bearer ${user.body.data.access_token}`)
        .send({
          password: 'newPassword',
        });

      user = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          password: 'newPassword',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(user.status).toBe(200);
    });
  });

  describe('PATCH /api/v1/users/current', () => {
    beforeEach(async () => {
      await testService.deleteAllGame();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createUserWithRoleAdmin();
    });
    it('should be rejected if request is invalid', async () => {
      const user = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      const response = await request(app.getHttpServer())
        .patch('/api/v1/users/current')
        .set('Authorization', `Bearer ${user.body.data.access_token}`)
        .send({
          name: '',
          password: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    it('should be able update username', async () => {
      const user = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      const response = await request(app.getHttpServer())
        .patch('/api/v1/users/current')
        .set('Authorization', `Bearer ${user.body.data.access_token}`)
        .send({
          name: 'test123',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test123');
    });
    it('should be able create game', async () => {
      const user = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: 'admin',
          password: 'admin',
        });

      const response = await request(app.getHttpServer())
        .post('/api/v1/games')
        .set('Authorization', `Bearer ${user.body.data.access_token}`)
        .send({
          title: 'test',
          image: 'test.png',
          summary: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe('test');
      expect(response.body.data.image).toBe('test.png');
      expect(response.body.data.summary).toBe('test');
    });
  });
});
