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

  // Teste para getPaymentsByReference com conteúdo
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

  // Teste para getPaymentsById
  it('Deve retornar um pedido de pagamento em produção por id', async () => {
    const mockPayment = {
    };
    mockPaymentsGateway.findId.mockResolvedValueOnce(mockPayment);

    const result = await PaymentsUseCases.getPaymentsById(
      BigInt(1),
      mockPaymentsGateway
    );
    expect(mockPaymentsGateway.findId).toHaveBeenCalledWith(BigInt(1));
    expect(result).toEqual(mockPayment);
  });
});
