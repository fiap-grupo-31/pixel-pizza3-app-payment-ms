import { PaymentsRabbitmqController } from './paymentsRabbitmq';
import { type DbConnection } from '../../domain/interfaces/dbconnection';

describe('PaymentsRabbitmqController', () => {
  describe('startConsuming', () => {
    it('should consume messages from RabbitMQ service', async () => {
      const dbconnection: DbConnection = { };
      const rabbitMqServiceMock = {
        consume: jest.fn()
      };

      await PaymentsRabbitmqController.startConsuming(dbconnection, rabbitMqServiceMock);

      expect(rabbitMqServiceMock.consume).toHaveBeenCalledWith('payments', expect.any(Function));
    });

    it('should call appropriate handler for consumed message event', async () => {
      const dbconnection: DbConnection = { };
      const rabbitMqServiceMock = {
        consume: jest.fn((topic: string, handler: Function) => {
          handler({ event: 'createPayment' });
        })
      };

      const createPaymentSpy = jest.spyOn(PaymentsRabbitmqController, 'createPayment');

      await PaymentsRabbitmqController.startConsuming(dbconnection, rabbitMqServiceMock);

      expect(createPaymentSpy).toHaveBeenCalledWith({ event: 'createPayment' }, dbconnection, rabbitMqServiceMock);
    });
  });

  describe('createPayment', () => {
    it('should send message to orders queue for rejected payment', async () => {
      const dbconnection: DbConnection = { };
      const rabbitMqServiceMock = {
        sendMessage: jest.fn()
      };

      await PaymentsRabbitmqController.createPayment({ orderId: '123' }, dbconnection, rabbitMqServiceMock);

      expect(rabbitMqServiceMock.sendMessage).toHaveBeenCalledWith('orders', {
        event: 'rejectOrder',
        orderId: '123',
        paymentReference: '',
        message: 'Error'
      });
    });

    it('should send message to orders queue for accepted payment', async () => {
      const dbconnection: DbConnection = { };
      const rabbitMqServiceMock = {
        sendMessage: jest.fn()
      };

      const paymentMock: string = JSON.stringify({ data: { _id: 'paymentId' } });
      jest.spyOn(PaymentsRabbitmqController, 'setPayment').mockResolvedValue(paymentMock);

      await PaymentsRabbitmqController.createPayment({ orderId: '123' }, dbconnection, rabbitMqServiceMock);

      expect(rabbitMqServiceMock.sendMessage).toHaveBeenCalledWith('orders', {
        event: 'aceptedOrder',
        orderId: '123',
        status: 'WAITING',
        paymentReference: 'paymentId',
        message: ''
      });
    });
  });

  describe('rejectPayment', () => {
    it('should update payment order status to CANCELED', async () => {
      const dbconnection: DbConnection = { };
      const x = await PaymentsRabbitmqController.rejectPayment({ orderId: '123' }, dbconnection);
      expect(x).toEqual('');
    });
  });
});
