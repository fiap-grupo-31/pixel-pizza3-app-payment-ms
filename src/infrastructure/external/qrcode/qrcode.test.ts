import { type QRCodeGenerator, QRCodeGeneratorAdapter } from './qrcode';
import qrcode from 'qrcode';

// Mock para qrcode
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockImplementation((data: any, callback: any) => {
    callback(null, 'fake_QR_data_URL');
  })
}));

describe('QRCodeGenerator Adapter', () => {
  let qrCodeGenerator: QRCodeGenerator;

  beforeEach(() => {
    qrCodeGenerator = new QRCodeGeneratorAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Teste para verificar se o método generateQRCode está presente
  it('should have a generateQRCode method', () => {
    expect(qrCodeGenerator.generateQRCode).toBeDefined();
    expect(typeof qrCodeGenerator.generateQRCode).toBe('function');
  });

  // Teste para verificar se o método generateQRCode retorna uma Promise
  it('generateQRCode method should return a Promise', () => {
    const result = qrCodeGenerator.generateQRCode('test data');
    expect(result).toBeInstanceOf(Promise);
  });

  // Teste para verificar se o método generateQRCode gera corretamente o QR Code
  it('generateQRCode method should generate QR code', async () => {
    const qrDataURL = await qrCodeGenerator.generateQRCode('test data');

    expect(qrcode.toDataURL).toHaveBeenCalledTimes(1);
    expect(qrDataURL).toBe('fake_QR_data_URL');
  });
});
