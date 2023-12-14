import { GenerateQRCodeUseCase } from './GemerateQrcode';

// Mock do QRCodeGenerator
const mockQRCodeGenerator = {
  generateQRCode: jest.fn(async (qrData: string) => await Promise.resolve(`http://example.com/${qrData}`))
};

describe('GenerateQRCodeUseCase', () => {
  let generateQRCodeUseCase: GenerateQRCodeUseCase;

  beforeEach(() => {
    generateQRCodeUseCase = new GenerateQRCodeUseCase(mockQRCodeGenerator as any);
  });

  // Teste para verificar se o execute chama o generateQRCode com os dados corretos
  it('should call generateQRCode with correct data', async () => {
    const qrData = 'testData';
    await generateQRCodeUseCase.execute(qrData);
    expect(mockQRCodeGenerator.generateQRCode).toHaveBeenCalledWith(qrData);
  });

  // Teste para verificar se o execute retorna a URL correta
  it('should return correct QR code URL', async () => {
    const qrData = 'testData';
    const qrCodeUrl = await generateQRCodeUseCase.execute(qrData);
    expect(qrCodeUrl).toBe(`http://example.com/${qrData}`);
  });

  // Teste para verificar se execute lança um erro quando falha ao gerar o QR Code
  it('should throw an error when QR code generation fails', async () => {
    const qrData = 'testData';
    const errorMessage = 'Failed to generate QR Code';
    mockQRCodeGenerator.generateQRCode.mockImplementationOnce(async () => await Promise.reject(new Error(errorMessage)));

    try {
      await generateQRCodeUseCase.execute(qrData);
    } catch (error: any) {
      expect(error?.message).toBe(errorMessage);
    }
  });
});
