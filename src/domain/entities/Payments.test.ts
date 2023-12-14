import { Payments } from './Payments';

describe('Payments class', () => {
  let payments: Payments;

  // Setup - criar uma nova instância da classe Payments antes de cada teste
  beforeEach(() => {
    payments = new Payments(
      1,
      'order123',
      'broker',
      'WAITING',
      'Description',
      2,
      100,
      new Date(),
      new Date()
    );
  });

  // Teste para verificar se a função get orderId retorna o valor correto
  it('should return correct orderId', () => {
    expect(payments.orderId).toBe('order123');
  });

  // Teste para verificar se a função get id retorna o valor correto
  it('should return correct id', () => {
    expect(payments.id).toBe(1);
  });

  // Teste para verificar se a função paymentCheck retorna true para um status válido
  it('should return true for valid payment status', () => {
    payments = new Payments(
      1,
      'order123',
      'broker',
      'APPROVED', // Alterando o status para um válido
      'Description',
      2,
      100,
      new Date(),
      new Date()
    );
    expect(payments.paymentCheck).toBe(true);
  });

  // Teste para verificar se a função paymentCheck retorna false para um status inválido
  it('should return false for invalid payment status', () => {
    payments = new Payments(
      1,
      'order123',
      'broker',
      'INVALID_STATUS', // Alterando o status para um inválido
      'Description',
      2,
      100,
      new Date(),
      new Date()
    );
    expect(payments.paymentCheck).toBe(false);
  });
});
