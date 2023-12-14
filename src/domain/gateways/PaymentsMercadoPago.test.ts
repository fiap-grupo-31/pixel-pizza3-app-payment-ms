import { PaymentsMercadoPagoGateway } from './PaymentsMercadoPago';

// Mock para HttpClient
const mockHttpClient = {
  post: jest.fn()
};

describe('PaymentsMercadoPagoGateway', () => {
  let mercadoPagoGateway: PaymentsMercadoPagoGateway;

  beforeEach(() => {
    mercadoPagoGateway = new PaymentsMercadoPagoGateway(mockHttpClient as any);
  });

  // Limpa os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Teste para createPayment - sucesso na criação de pagamento
  it('should create payment successfully', async () => {
    const mockData = {/* mock data */};
    const mockResponse = {/* mock response */};
    mockHttpClient.post.mockResolvedValueOnce(mockResponse);
    process.env.MELI_USER_ID = '1';
    process.env.MELI_POSID = '1';
    process.env.MELI_TOKEN = '00'
    const result = await mercadoPagoGateway.createPayment(mockData);
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      'https://api.mercadopago.com/instore/orders/qr/seller/collectors/1/pos/1/qrs',
      mockData,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer 00'
        }
      }
    );
    expect(result).toEqual(mockResponse);
  });

  // Teste para createPayment - falha na criação de pagamento
  it('should throw an error when payment creation fails', async () => {
    const mockData = {/* mock data */};
    const errorMessage = 'Erro ao criar pagamento no Mercado Pago';
    mockHttpClient.post.mockRejectedValueOnce(new Error(errorMessage));

    try {
      await mercadoPagoGateway.createPayment(mockData);
    } catch (error: any) {
      expect(error.message).toBe(errorMessage);
    }
    expect(mockHttpClient.post).toHaveBeenCalled();
  });
});
