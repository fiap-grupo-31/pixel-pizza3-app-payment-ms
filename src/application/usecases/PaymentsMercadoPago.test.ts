import { PaymentsMercadoPagoUseCases } from './PaymentsMercadoPago';

// Mock para PaymentsMercadoPagoInterface
const mockPaymentsMercadoPagoInterface = {
  createPayment: jest.fn(),
};

describe('PaymentsMercadoPagoUseCases', () => {
  // Limpa os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Teste para createPayment - sucesso na criação de pagamento
  it('should create payment successfully', async () => {
    const mockPaymentData = {/* mock data */};
    mockPaymentsMercadoPagoInterface.createPayment.mockResolvedValueOnce(mockPaymentData);

    const result = await PaymentsMercadoPagoUseCases.createPayment(mockPaymentData, mockPaymentsMercadoPagoInterface);
    expect(mockPaymentsMercadoPagoInterface.createPayment).toHaveBeenCalledWith(mockPaymentData);
    expect(result).toEqual(mockPaymentData);
  });

  // Teste para createPayment - falha na criação de pagamento
  it('should throw an error when payment creation fails', async () => {
    const errorMessage = 'Erro ao criar pagamento';
    mockPaymentsMercadoPagoInterface.createPayment.mockRejectedValueOnce(new Error(errorMessage));

    try {
      await PaymentsMercadoPagoUseCases.createPayment({}, mockPaymentsMercadoPagoInterface);
    } catch (error: any) {
      expect(error?.message).toBe(errorMessage);
    }
    expect(mockPaymentsMercadoPagoInterface.createPayment).toHaveBeenCalled();
  });
});
