/* eslint-disable prefer-promise-reject-errors */
import { Payments } from '../../domain/entities/Payments';
import { type PaymentsGatewayInterface } from '../../domain/interfaces/PaymentsGatewayInterface';

class PaymentsUseCases {
  static async getPaymentsAll (
    paymentsGateway: PaymentsGatewayInterface
  ): Promise<Payments[] | null> {
    return await paymentsGateway.findAll();
  }

  static async getPaymentsByReference (
    reference: Record<string, any> = {},
    paymentsGateway: PaymentsGatewayInterface
  ): Promise<Payments[] | null> {
    return await paymentsGateway.find(reference);
  }

  static async getPaymentsById (
    id: bigint,
    paymentsGateway: PaymentsGatewayInterface
  ): Promise<Payments | null> {
    return await paymentsGateway.findId(id);
  }

  static async setPayment (
    orderId: string,
    broker: string,
    payment: string,
    description: string,
    quantity: number,
    amount: number,
    paymentsGateway: PaymentsGatewayInterface
  ): Promise<Payments | null> {
    if (!orderId) return await Promise.reject('orderId inválid');
    if (!broker) return await Promise.reject('broker inválid');
    if (!payment) return await Promise.reject('status inválid');

    try {
      const payments = await paymentsGateway.persist(
        orderId,
        broker,
        payment,
        description,
        quantity,
        amount
      );
      return new Payments(
        payments._id,
        payments.orderId,
        payments.broker,
        payments.payment,
        payments.description,
        payments.quantity,
        payments.amount,
        payments.created_at,
        payments.updated_at
      );
    } catch (error) {
      return await Promise.reject('failure insert');
    }
  }

  static async updatePayment (
    id: bigint,
    orderId: string,
    broker: string,
    payment: string,
    description: string,
    paymentsGateway: PaymentsGatewayInterface
  ): Promise<Payments | null> {
    if (!id) return await Promise.reject('id inválid');
    if (!orderId) return await Promise.reject('orderId inválid');
    if (!broker) return await Promise.reject('broker inválid');

    const entity = new Payments(
      id,
      orderId,
      broker,
      payment,
      description,
      0,
      0,
      null,
      null
    );
    if (!entity.paymentCheck) return await Promise.reject('payment inválid');

    try {
      const payments = await paymentsGateway.update(
        id,
        orderId,
        broker,
        payment,
        description
      );
      return new Payments(
        payments._id,
        payments.orderId,
        payments.broker,
        payments.payment,
        payments.description,
        payments.quantity,
        payments.amount,
        payments.created_at,
        payments.updated_at
      );
    } catch (error) {
      return await Promise.reject('failure update');
    }
  }
}

export { PaymentsUseCases };
