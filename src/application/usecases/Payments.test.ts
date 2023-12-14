import { PaymentsUseCases } from './Payments';
import { Payments } from '../../domain/entities';

// Mock para PaymentsGatewayInterface
const mockPaymentsGateway = {
  findAll: jest.fn(),
  find: jest.fn(),
  findId: jest.fn(),
  persist: jest.fn(),
  update: jest.fn()
};

const mockPaymentDataDefault = {
  id: 1,
  orderId: '111',
  broker: 'fake',
  payment: 'WAITING',
  description: '',
  quantity: 2,
  amount: 100,
  created_at: '',
  updated_at: ''
};

describe('PaymentsUseCases', () => {
  // Limpa os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Teste para getPaymentsAll
  it('should get all payments', async () => {
    mockPaymentsGateway.findAll.mockResolvedValueOnce([
      /* mock data */
    ]);

    const result = await PaymentsUseCases.getPaymentsAll(mockPaymentsGateway);
    expect(mockPaymentsGateway.findAll).toHaveBeenCalled();
    expect(result).toEqual([
      /* mock data */
    ]);
  });

  // Teste para getPaymentsByReference
  it('should get payments by reference', async () => {
    mockPaymentsGateway.find.mockResolvedValueOnce([
      /* mock data */
    ]);

    const result = await PaymentsUseCases.getPaymentsByReference(
      {},
      mockPaymentsGateway
    );
    expect(mockPaymentsGateway.find).toHaveBeenCalledWith({});
    expect(result).toEqual([
      /* mock data */
    ]);
  });

  // Teste para getPaymentsById
  it('should get payment by ID', async () => {
    const mockPayment = {
      /* mock data */
    };
    mockPaymentsGateway.findId.mockResolvedValueOnce(mockPayment);

    const result = await PaymentsUseCases.getPaymentsById(
      BigInt(1),
      mockPaymentsGateway
    );
    expect(mockPaymentsGateway.findId).toHaveBeenCalledWith(BigInt(1));
    expect(result).toEqual(mockPayment);
  });

  // Teste para setPayment
  it('should set payment', async () => {
    const mockPaymentData = mockPaymentDataDefault;
    mockPaymentsGateway.persist.mockResolvedValueOnce(mockPaymentData);

    const result = await PaymentsUseCases.setPayment(
      '12345678910',
      'fake',
      'WAITING',
      '',
      2,
      100,
      mockPaymentsGateway
    );
    expect(mockPaymentsGateway.persist).toHaveBeenCalledWith(
      '12345678910',
      'fake',
      'WAITING',
      '',
      2,
      100
    );

    expect(result).toEqual(new Payments(undefined, '111', 'fake', 'WAITING', '', 2, 100, '', ''));
  });

  // Teste para updatePayment
  it('should update payment', async () => {
    const mockUpdatedPayment = {
      amount: 100,
      broker: 'fake',
      created_at: '',
      description: '',
      id: 1,
      orderId: '111',
      quantity: 2,
      payment: 'WAITING',
      updated_at: ''
    };
    mockPaymentsGateway.update.mockResolvedValueOnce(mockUpdatedPayment);

    const result = await PaymentsUseCases.updatePayment(
      BigInt(1),
      '12345678910',
      'fake',
      'WAITING',
      'teste',
      mockPaymentsGateway
    );

    expect(mockPaymentsGateway.update).toHaveBeenCalledWith(
      BigInt(1),
      '12345678910',
      'fake',
      'WAITING',
      'teste'
    );
    expect(result).toEqual(new Payments(undefined, '111', 'fake', 'WAITING', '', 2, 100, '', ''));
  });
});
