import { PaymentsUseCases } from './Payments';
import { OrderApiAdapter } from '../../interfaces/adapters/OrderApiAdapter';
import { Payments } from '../../domain/entities';

// Mock para PaymentsGatewayInterface
const mockPaymentsGateway = {
  findAll: jest.fn(),
  find: jest.fn(),
  findId: jest.fn(),
  persist: jest.fn(),
  update: jest.fn()
};

describe('Produção', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve retornar todos os pedido de pagamentos de pagamento em produção', async () => {
    mockPaymentsGateway.findAll.mockResolvedValueOnce([
    ]);

    const result = await PaymentsUseCases.getPaymentsAll(mockPaymentsGateway);
    expect(mockPaymentsGateway.findAll).toHaveBeenCalled();
    expect(result).toEqual([
    ]);
  });

  it('Deve retornar uma lista vazia de pedido de pagamentos de pagamento em produção', async () => {
    mockPaymentsGateway.findAll.mockResolvedValueOnce([
    ]);

    const result = await PaymentsUseCases.getPaymentsByReference(
      {},
      mockPaymentsGateway
    );
    expect(mockPaymentsGateway.findAll).toHaveBeenCalledWith({});
    expect(result).toEqual([
    ]);
  });

  it('Deve retornar um pedido de pagamento por referencia ( status )', async () => {
    mockPaymentsGateway.findAll.mockResolvedValueOnce([
    ]);

    const result = await PaymentsUseCases.getPaymentsByReference(
      {
        id: 1
      },
      mockPaymentsGateway
    );
    expect(mockPaymentsGateway.findAll).toHaveBeenCalledWith({
      id: 1
    });
    expect(result).toEqual([]);
  });

  it('Deve retornar um pedido de pagamento em produção por id', async () => {
    const mockPayment = {
    };
    mockPaymentsGateway.findId.mockResolvedValueOnce(mockPayment);

    const result = await PaymentsUseCases.getPaymentsById(
      BigInt(1),
      mockPaymentsGateway
    );
    expect(mockPaymentsGateway.findId).toHaveBeenCalledWith(BigInt(1));
  });

  it('Deve retornar sucesso ao tentar inserir um pedido de pagamento', async () => {
    const current = {
      dataValues: {
        id: 1,
        orderId: '111',
        broker: 'fake',
        payment: 'WAITING',
        description: 'TESTE',
        quantity: 0,
        amount: 0,
        created_at: new Date('2000-10-10'),
        updated_at: new Date('2000-10-10')
      }
    };
    mockPaymentsGateway.persist.mockResolvedValueOnce(current);

    const resume = await PaymentsUseCases.setPayment(
      '111',
      'fake',
      'WAITING',
      'TESTE',
      0,
      0,
      mockPaymentsGateway
    );
    expect(resume).toEqual(new Payments(1, '111', 'fake', 'WAITING', 'TESTE', 0, 0, new Date('2000-10-10') , new Date('2000-10-10')));
  });

  it('Deve retornar uma exceção ao tentar inserir um pedido de pagamento', async () => {
    const expectedError = 'failure insert';
    mockPaymentsGateway.persist.mockRejectedValueOnce(expectedError);

    try {
      await PaymentsUseCases.setPayment(
        '111',
        'fake',
        'WAITING',
        'TESTE',
        0,
        0,
        mockPaymentsGateway
      );
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe('failure insert');
    }
  });

  it('Deve retornar uma exceção ao tentar atualizar um pedido de pagamento', async () => {
    const expectedError = 'failure update';
    mockPaymentsGateway.update.mockRejectedValueOnce(expectedError);

    const orderApiAdapter = new OrderApiAdapter('', false);

    try {
      await PaymentsUseCases.updatePayment(
        BigInt(1),
        '111',
        'fake',
        'WAITING',
        'TESTE',
        orderApiAdapter,
        mockPaymentsGateway
      );
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe('failure update');
    }
  });

  it('Deve retornar uma exceção ao tentar atualizar um pedido de pagamento por payment invalid', async () => {
    const expectedError = 'payment inválid';
    mockPaymentsGateway.update.mockRejectedValueOnce(expectedError);

    const orderApiAdapter = new OrderApiAdapter('', false);

    try {
      await PaymentsUseCases.updatePayment(
        BigInt(1),
        '111',
        'fake',
        'WAITINGs',
        'TESTE',
        orderApiAdapter,
        mockPaymentsGateway
      );
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe('payment inválid');
    }
  });
});
