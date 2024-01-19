import { PaymentsGateway } from './Payments';
import { Payments } from '../entities';

const mockDbConnection: any = {
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

describe('PaymentsGateway', () => {
  let paymentsGateway: PaymentsGateway;

  beforeEach(() => {
    paymentsGateway = new PaymentsGateway(mockDbConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve buscar um pedido de pagamento por ID', async () => {
    const mockedPayments: Payments = new Payments(1, '123', 'mercadopago', 'APPROVED', 'teste', 1, 1, new Date('2023-01-01'), new Date('2023-01-01'));

    mockDbConnection.findId.mockResolvedValueOnce(mockedPayments);

    const result = await paymentsGateway.findId(BigInt(1));

    expect(mockDbConnection.findId).toHaveBeenCalledWith('payments', BigInt(1));
    expect(result).toEqual(mockedPayments);
  });

  it('Deve buscar um pedido de pagamento por ID com retorno null', async () => {
    const mockedPayments: any = null;

    mockDbConnection.findId.mockResolvedValueOnce(null);

    const result = await paymentsGateway.findId(BigInt(2));

    expect(mockDbConnection.findId).toHaveBeenCalledWith('payments', BigInt(2));
    expect(result).toEqual(mockedPayments);
  });

  it('Deve buscar todos os pedido de pagamentos com filtro e com retorno null', async () => {
    const mockedPayments: any = null;

    mockDbConnection.find.mockResolvedValueOnce(null);

    const result = await paymentsGateway.find({});

    expect(result).toEqual(mockedPayments);
  });

  it('Deve buscar todos os pedido de pagamentos com filtro', async () => {
    const mockedPayments: Payments[] = [new Payments(1, '123', 'mercadopago', 'APPROVED', 'teste', 1, 1, new Date('2023-01-01'), new Date('2023-01-01'))];

    mockDbConnection.find.mockResolvedValueOnce(mockedPayments);

    const result = await paymentsGateway.find({});

    expect(mockDbConnection.find).toHaveBeenCalledWith('payments', {});
    expect(result).toEqual(mockedPayments);
  });

  it('Deve buscar pedido de pagamentos por referência', async () => {
    const reference = { status: 'WAITING' };
    const mockedPaymentss: Payments[] = [
    ];

    mockDbConnection.find.mockResolvedValueOnce(mockedPaymentss);

    const result = await paymentsGateway.find(reference);

    expect(mockDbConnection.find).toHaveBeenCalledWith('payments', reference);
    expect(result).toEqual(mockedPaymentss);
  });
});
