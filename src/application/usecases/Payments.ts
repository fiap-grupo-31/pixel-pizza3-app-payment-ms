/* eslint-disable prefer-promise-reject-errors */
import { Payments } from '../../domain/entities/Payments';
import { type PaymentsGatewayInterface } from '../../domain/interfaces/PaymentsGatewayInterface';
import { type OrderApiAdapter } from '../../interfaces/adapters/OrderApiAdapter';

class PaymentsUseCases {
  static async getPaymentsAll (
    paymentsGateway: PaymentsGatewayInterface
  ): Promise<Payments[] | null> {
    return await paymentsGateway.findAll({});
  }

  static async getPaymentsByReference (
    reference: Record<string, any>,
    paymentsGateway: PaymentsGatewayInterface
  ): Promise<Payments[] | null> {
    return await paymentsGateway.findAll(reference);
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
        payments?.dataValues.id,
        payments?.dataValues.orderId,
        payments?.dataValues.broker,
        payments?.dataValues.payment,
        payments?.dataValues.description,
        payments?.dataValues.quantity,
        payments?.dataValues.amount,
        payments?.dataValues.created_at,
        payments?.dataValues.updated_at
      );
    } catch (error) {
      throw new Error('failure insert');
    }
  }

  static async updatePayment (
    id: bigint,
    orderId: string,
    broker: string,
    payment: string,
    description: string,
    orderApiAdapter: OrderApiAdapter,
    paymentsGateway: PaymentsGatewayInterface
  ): Promise<Payments | null> {
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
    if (!entity.paymentCheck) {
      throw new Error('payment inválid');
    }

    try {
      await paymentsGateway.update(
        id,
        orderId,
        broker,
        payment,
        description
      );
      const payments = await paymentsGateway.findId(id);

      await orderApiAdapter.updatePaymentOrder(payments?.orderId ?? '', payment)

      return new Payments(
        payments?.id,
        payments?.orderId ?? '',
        payments?.broker ?? '',
        payments?.payment ?? '',
        payments?.description ?? '',
        payments?.quantity ?? 0,
        payments?.amount ?? 0,
        payments?.created_at ?? '',
        payments?.updated_at ?? ''
      );
    } catch (error) {
      throw new Error('failure update');
    }
  }
}

export { PaymentsUseCases };
