import request from 'supertest';
import { FastfoodApp } from './index';
import { PaymentsController } from '../controllers/payments';

jest.mock('../controllers/payments');

describe('FastfoodApp', () => {
  let fastfoodApp: FastfoodApp;
  let mockDbConnection: any;

  beforeAll(() => {
    mockDbConnection = {};
    process.env.PORT = '9010';
    fastfoodApp = new FastfoodApp(mockDbConnection);
    fastfoodApp.start();
  });

  afterAll(() => {
    fastfoodApp.stop();
  });

  describe('Configuração da Aplicação', () => {
    it('deve configurar a aplicação corretamente', () => {
      expect(fastfoodApp).toBeInstanceOf(FastfoodApp);
    });

    it('deve configurar os middlewares corretamente', () => {
    });
  });

  describe('Endpoints', () => {
    it('deve fornecer a especificação Swagger em /swagger.json', async () => {
      const response = await request(fastfoodApp._app).get('/swagger.json');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve fornecer a documentação Swagger em /api-docs', async () => {
      const response = await request(fastfoodApp._app).get('/api-docs');
      expect(response.headers['content-type']).toContain('text/html; charset=UTF-8');
    });

    it('deve responder corretamente ao endpoint /payment', async () => {
      const mockProductionData = '[]';
      (PaymentsController.getPayments as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/payment');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /payment/:id', async () => {
      const mockProductionData = '{}';
      (PaymentsController.getPaymentsById as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/payment/1');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /payment/order/:id', async () => {
      const mockProductionData = '[]';
      (PaymentsController.getPaymentsByOrderId as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).get('/payment/order/1');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /payment ( post )', async () => {
      const mockProductionData = '[]';
      (PaymentsController.setPayment as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).post('/payment');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /payment/webhook/fake/:paymentId ( post )', async () => {
      const mockProductionData = '[]';
      (PaymentsController.updatePayment as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).post('/payment/webhook/fake/1');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('deve responder corretamente ao endpoint /payment/webhook/mercadopago/:paymentId ( post )', async () => {
      const mockProductionData = '[]';
      (PaymentsController.updatePayment as jest.Mock).mockResolvedValue(mockProductionData);

      const response = await request(fastfoodApp._app).post('/payment/webhook/mercadopago/1');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });
  });
});
