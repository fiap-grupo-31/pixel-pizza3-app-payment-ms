import { PaymentsGateway } from './Payments';
import { Payments } from '../entities';

// Mock para DbConnection
const mockDbConnection = {
  findId: jest.fn(),
  find: jest.fn(),
  findAll: jest.fn(),
  persist: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
};

const mockPaymentDataDefault = {
  id: 1,
  orderId: '111',
  broker: 'fake',
  payment: 'WAITING',
  description: '',
  quantity: 0,
  amount: 0,
  created_at: '',
  updated_at: ''
};

const mockPaymentDataDefaultEntity = new Payments(
  1,
  '111',
  'fake',
  'WAITING',
  '',
  0,
  0,
  '',
  ''
);

describe('PaymentsGateway', () => {
  let paymentsGateway: PaymentsGateway;

  beforeEach(() => {
    paymentsGateway = new PaymentsGateway(mockDbConnection as any);
  });

  // Limpa os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Teste para findId
  it('should find payment by ID', async () => {
    const mockPaymentData = mockPaymentDataDefault;
    mockDbConnection.findId.mockResolvedValueOnce(mockPaymentData);

    const result = await paymentsGateway.findId(BigInt(1));
    expect(mockDbConnection.findId).toHaveBeenCalledWith('payments', BigInt(1));
    expect(result).toEqual(mockPaymentDataDefaultEntity);
  });

  // Teste para find
  it('should find payments by reference', async () => {
    const mockPaymentData = [mockPaymentDataDefault];
    mockDbConnection.find.mockResolvedValueOnce(mockPaymentData);

    const result = await paymentsGateway.find({});
    expect(mockDbConnection.find).toHaveBeenCalledWith('payments', {});
    expect(result).toEqual([mockPaymentDataDefaultEntity]);
  });

  // Teste para findAll
  it('should find all payments', async () => {
    const mockPaymentData = [mockPaymentDataDefault];
    mockDbConnection.findAll.mockResolvedValueOnce(mockPaymentData);

    const result = await paymentsGateway.findAll();
    expect(mockDbConnection.findAll).toHaveBeenCalledWith('payments');
    expect(result).toEqual([mockPaymentDataDefaultEntity]);
  });

  // Teste para persist
  it('should persist payment', async () => {
    const mockSuccess = true;
    mockDbConnection.persist.mockResolvedValueOnce(mockSuccess);

    const result = await paymentsGateway.persist(
      '111',
      'fake',
      'WAITING', // Alterando o status para um inválido
      '',
      0,
      0
    );

    const resume = {
      amount: 0,
      broker: 'fake',
      description: '',
      orderId: '111',
      payment: 'WAITING',
      quantity: 0
    };
    expect(mockDbConnection.persist).toHaveBeenCalledWith('payments', resume);
    expect(result).toEqual(true);
  });

  // Teste para update
  it('should update payment', async () => {
    const mockSuccess = true;
    mockDbConnection.update.mockResolvedValueOnce(mockSuccess);

    const result = await paymentsGateway.update(
      BigInt(1),
      '123456789',
      'fake',
      'WAITING',
      ''
    );

    const resume = {
      broker: 'fake',
      description: '',
      orderId: '123456789',
      payment: 'WAITING'
    };

    expect(mockDbConnection.update).toHaveBeenCalledWith('payments', BigInt(1), resume);
    expect(result).toEqual(true);
  });

  // Teste para remove
  it('should remove payment by ID', async () => {
    const mockResult = mockPaymentDataDefault;
    mockDbConnection.remove.mockResolvedValueOnce(mockResult);

    const result = await paymentsGateway.remove(BigInt(1));
    expect(mockDbConnection.remove).toHaveBeenCalledWith('payments', BigInt(1));
    expect(result).toEqual(mockPaymentDataDefault);
  });
});
