import { PaymentsController } from './payments';
import { Payments } from '../../domain/entities';

describe('PaymentsController', () => {
  let mockDbConnection: any;
  let _rabbitMqService: any;

  beforeEach(() => {
    mockDbConnection = {
      findId: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      persist: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeFind: async function (Schema: string, Reference: Record<string, any>): Promise<any> {
        throw new Error('Function not implemented.');
      }
    };

    _rabbitMqService = {
      _rabbitMqService: {
        sendMessage: async function (queue: any, data: any) {
          return true;
        }
      }
    }
  });

  describe('Classe PaymentsController', () => {
    it('deve retornar todos os itens de pedidos de pagamento', async () => {
      const mockedPayments: Payments[] = [new Payments(1, '123', 'fake', 'APPROVED', 'teste', 1, 1, new Date('2023-01-01'), new Date('2023-01-01'))];
      mockDbConnection.findAll.mockResolvedValueOnce(mockedPayments);
      const result = await PaymentsController.getPayments(mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":200,"status":"success","data":[{"_id":1,"_orderId":"123","_broker":"fake","_payment":"APPROVED","_description":"teste","_quantity":1,"_amount":1,"_created_at":"2023-01-01T00:00:00.000Z","_updated_at":"2023-01-01T00:00:00.000Z"}]}');
    });

    it('deve retornar um exception para todos os itens de pedidos de pagamento', async () => {
      mockDbConnection.findAll.mockResolvedValueOnce(new Error('error'));
      const result = await PaymentsController.getPayments(mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":404,"status":"error","message":{}}');
    });

    it('deve retornar os items de pedidos de pagamento por status', async () => {
      const mockedPayments: Payments[] = [new Payments(1, '123', 'fake', 'APPROVED', 'teste', 1, 1, new Date('2023-01-01'), new Date('2023-01-01'))];
      mockDbConnection.findAll.mockResolvedValueOnce(mockedPayments);

      const result = await PaymentsController.getPaymentsByStatus('APPROVED', mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":200,"status":"success","data":[{"_id":1,"_orderId":"123","_broker":"fake","_payment":"APPROVED","_description":"teste","_quantity":1,"_amount":1,"_created_at":"2023-01-01T00:00:00.000Z","_updated_at":"2023-01-01T00:00:00.000Z"}]}');
    });

    it('deve retornar os items de pedidos de pagamento por orderId', async () => {
      const mockedPayments: Payments[] = [new Payments(1, '123', 'fake', 'APPROVED', 'teste', 1, 1, new Date('2023-01-01'), new Date('2023-01-01'))];
      mockDbConnection.findAll.mockResolvedValueOnce(mockedPayments);

      const result = await PaymentsController.getPaymentsByOrderId('123', mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":200,"status":"success","data":[{"_id":1,"_orderId":"123","_broker":"fake","_payment":"APPROVED","_description":"teste","_quantity":1,"_amount":1,"_created_at":"2023-01-01T00:00:00.000Z","_updated_at":"2023-01-01T00:00:00.000Z"}]}');
    });

    it('deve retornar um exception na consulta por orderId', async () => {
      mockDbConnection.findAll.mockResolvedValueOnce(new Error('error'));

      const result = await PaymentsController.getPaymentsByOrderId('123', mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":404,"status":"error","message":{}}');
    });

    it('deve retornar um exception para items de pedidos de pagamento por status', async () => {
      mockDbConnection.find.mockResolvedValueOnce(new Error('error'));
      const result = await PaymentsController.getPaymentsByStatus('DONE', mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":404,"status":"error","message":{}}');
    });

    it('deve retornar os items de pedidos de pagamento por id', async () => {
      const mockedPayments: Payments[] = [new Payments(1, '123', 'fake', 'APPROVED', 'teste', 1, 1, new Date('2023-01-01'), new Date('2023-01-01'))];
      mockDbConnection.findId.mockResolvedValueOnce(mockedPayments);

      const result = await PaymentsController.getPaymentsById(BigInt(1), mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_orderId":"","_broker":"","_payment":"","_description":"","_amount":0,"_created_at":"","_updated_at":""}}');
    });

    it('deve retornar falha em pedidos de pagamento por id', async () => {
      try {
        const expectedError = 'failure insert';
        mockDbConnection.findId.mockRejectedValueOnce(expectedError);

        await PaymentsController.getPaymentsById(BigInt(1), mockDbConnection);
      } catch (error: any) {
        expect(error.message).toBe('failure insert');
      }
    });

    it('deve retornar um exception na consulta por id', async () => {
      mockDbConnection.findId.mockResolvedValueOnce(new Error('error'));

      const result = await PaymentsController.getPaymentsById(BigInt(1), mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_orderId":"","_broker":"","_payment":"","_description":"","_amount":0,"_created_at":"","_updated_at":""}}');
    });

    it('deve retornar atualizar um item de pedidos de pagamento', async () => {
      const mockedPayments: Payments[] = [new Payments(1, '123', 'fake', 'APPROVED', 'teste', 1, 1, new Date('2023-01-01'), new Date('2023-01-01'))];
      mockDbConnection.update.mockResolvedValueOnce(mockedPayments);
      mockDbConnection.findId.mockResolvedValueOnce(mockedPayments);

      const result = await PaymentsController.updatePaymentOrder(
        '65aae5bc0bae1160640cb836',
        'APPROVED',
        'TESTE',
        mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_orderId":"","_broker":"","_payment":"","_description":"","_quantity":0,"_amount":0,"_created_at":"","_updated_at":""}}');
    });

    it('deve retornar um exception atualizar um item de pedidos de pagamento por order', async () => {
      mockDbConnection.update.mockResolvedValueOnce(new Error('error'));
      mockDbConnection.findId.mockResolvedValueOnce(new Error('error'));
      const result = await PaymentsController.updatePaymentOrder(
        '65aae5bc0bae1160640cb836',
        'APPROVED',
        'TESTE',
        mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('deve retornar um exception atualizar um item de pedidos de pagamento', async () => {
      mockDbConnection.update.mockResolvedValueOnce(new Error('error'));
      mockDbConnection.findId.mockResolvedValueOnce(new Error('error'));
      const result = await PaymentsController.updatePayment(
        BigInt(2),
        '65aae5bc0bae1160640cb836',
        'fake',
        'APPROVED',
        '',
        _rabbitMqService,
        mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":404,"status":"error","message":{}}');
    });

    it('deve retornar um exception atualizar um item de pedidos de pagamento 2', async () => {
      mockDbConnection.update.mockResolvedValueOnce(new Error('error'));
      mockDbConnection.findId.mockResolvedValueOnce(new Error('error'));
      const result = await PaymentsController.updatePayment(
        BigInt(2),
        '65aae5bc0bae1160640cb836',
        'fake',
        'payment.created',
        '',
        _rabbitMqService,
        mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":404,"status":"error","message":{}}');
    });

    it('deve retornar um exception por status vazio atualizar um item de pedidos de pagamento', async () => {
      mockDbConnection.update.mockResolvedValueOnce(new Error('error'));
      mockDbConnection.findId.mockResolvedValueOnce(new Error('error'));
      const result = await PaymentsController.updatePayment(
        BigInt(2),
        '65aae5bc0bae1160640cb836',
        'fake',
        '',
        '',
        _rabbitMqService,
        mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":404,"status":"error","message":"status invalid"}');
    });

    it('deve inserir um novo item de pedidos de pagamento', async () => {
      const mockedPayments: Payments = new Payments(1, '123', 'fake', 'APPROVED', 'teste', 1, 1, new Date('2023-01-01'), new Date('2023-01-01'));
      mockDbConnection.update.mockResolvedValueOnce(mockedPayments);
      mockDbConnection.findId.mockResolvedValueOnce(mockedPayments);
      mockDbConnection.persist.mockResolvedValueOnce(mockedPayments);

      const result = await PaymentsController.setPayment(
        '65aae5bc0bae1160640cb836',
        'fake',
        'APPROVED',
        'teste',
        1,
        1,
        'teste',
        mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"statusCode":404,"status":"error","message":{}}}');
    });

    it('deve inserir um exception ao tentar inserir novo item de pedidos de pagamento via meli', async () => {
      const mockedPayments: Payments = new Payments(1, '123', 'mercadopago', 'APPROVED', 'teste', 1, 1, new Date('2023-01-01'), new Date('2023-01-01'));
      mockDbConnection.update.mockResolvedValueOnce(mockedPayments);
      mockDbConnection.findId.mockResolvedValueOnce(mockedPayments);
      mockDbConnection.persist.mockResolvedValueOnce(mockedPayments);

      const result = await PaymentsController.setPayment(
        '65aae5bc0bae1160640cb836',
        'mercadopago',
        'APPROVED',
        'teste',
        1,
        1,
        'teste',
        mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"statusCode":404,"status":"error","message":{}}}');
    });

    it('deve retornar um exception ao tentar inserir um novo item de pedidos de pagamento com broker invalido', async () => {
      const mockedPayments: Payments = new Payments(1, '123', 'fake', 'APPROVED', 'teste', 1, 1, new Date('2023-01-01'), new Date('2023-01-01'));
      mockDbConnection.update.mockResolvedValueOnce(mockedPayments);
      mockDbConnection.findId.mockResolvedValueOnce(mockedPayments);
      mockDbConnection.persist.mockResolvedValueOnce(mockedPayments);

      const result = await PaymentsController.setPayment(
        '65aae5bc0bae1160640cb836',
        'fake1',
        'APPROVED',
        'teste',
        1,
        1,
        'teste',
        mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":404,"status":"error","message":"escolha o broker fake ou mercadopago"}');
    });
  });
});
