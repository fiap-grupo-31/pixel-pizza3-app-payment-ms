/* eslint-disable @typescript-eslint/no-this-alias */
import { PaymentsController } from './payments';
import { type DbConnection } from '../../domain/interfaces/dbconnection';

export class PaymentsRabbitmqController {
  static async startConsuming (_dbconnection: DbConnection, _rabbitMqService: any): Promise<void> {
    try {
      _rabbitMqService.consume('payments', (message: any) => {
        const fn: any = this
        console.log(message)
        if (typeof fn[message.event] !== 'undefined') {
          fn[message.event](message, _dbconnection, _rabbitMqService);
        }
      });
    } catch (error) {
    }
  }

  static async createPayment (data: any, _dbconnection: DbConnection, _rabbitMqService: any): Promise<any> {
    const payment = await PaymentsController.setPayment(
      data?.orderId,
      data?.mode,
      '',
      '',
      data?.quantity,
      data?.amount,
      process.env.API_PAYMENT_BASEURL ?? '',
      _dbconnection
    )

    const paymentObject = JSON.parse(payment);

    if (!paymentObject?.data?._id) {
      _rabbitMqService.sendMessage('orders', {
        event: 'rejectOrder',
        orderId: data?.orderId,
        paymentReference: '',
        message: 'Error'
      })
    } else {
      _rabbitMqService.sendMessage('orders', {
        event: 'aceptedOrder',
        orderId: data?.orderId,
        status: 'WAITING',
        paymentReference: paymentObject?.data?._id,
        message: ''
      })
    }
  }

  static async rejectPayment (data: any, _dbconnection: DbConnection): Promise<any> {
    console.log(data)
    await PaymentsController.updatePaymentOrder(
      data?.orderId,
      'CANCELED',
      '',
      _dbconnection
    )
  }
}
