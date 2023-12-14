import { Payments } from '../entities';
import { type DbConnection } from '../interfaces/dbconnection';
import { type PaymentsGatewayInterface } from '../interfaces/PaymentsGatewayInterface';

export class PaymentsGateway implements PaymentsGatewayInterface {
  private readonly repositorioDados: DbConnection;
  private readonly schema = 'payments';

  constructor (database: DbConnection) {
    this.repositorioDados = database;
  }

  async findId (id: bigint): Promise<Payments | null> {
    const result = await this.repositorioDados.findId(this.schema, id);

    if (result === null) {
      return null;
    } else {
      return new Payments(
        result.id,
        result.orderId,
        result.broker,
        result.payment,
        result.description,
        result.quantity,
        result.amount,
        result.created_at,
        result.updated_at
      );
    }
  }

  async find (reference: Record<string, any>): Promise<Payments[] | null> {
    const result = await this.repositorioDados.find(this.schema, reference);

    if (result === null) {
      return null;
    } else {
      const returnData: Payments[] = [];
      result.forEach((element: any) => {
        returnData.push(
          new Payments(
            element.id,
            element.orderId,
            element.broker,
            element.payment,
            element.description,
            element.quantity,
            element.amount,
            element.created_at,
            element.updated_at
          )
        );
      });
      return returnData;
    }
  }

  async findAll (): Promise<Payments[] | null> {
    const result = await this.repositorioDados.findAll(this.schema);

    if (result === null) {
      return null;
    } else {
      const returnData: Payments[] = [];
      result.forEach((element: any) => {
        returnData.push(
          new Payments(
            element.id,
            element.orderId,
            element.broker,
            element.payment,
            element.description,
            element.quantity,
            element.amount,
            element.created_at,
            element.updated_at
          )
        );
      });
      return returnData;
    }
  }

  async persist (
    orderId: string,
    broker: string,
    status: string,
    description: string,
    quantity: number,
    amount: number
  ): Promise<any> {
    const payments = new Payments(
      null,
      orderId,
      broker,
      status,
      description,
      quantity,
      amount,
      null,
      null
    )

    const success = await this.repositorioDados.persist(
      this.schema,
      {
        orderId: payments.orderId,
        broker: payments.broker,
        payment: payments.payment,
        description: payments.description,
        quantity: payments.quantity,
        amount: payments.amount
      }
    );

    return success;
  }

  async update (
    id: bigint,
    orderId: string,
    broker: string,
    payment: string,
    description: string
  ): Promise<any> {
    const payments = new Payments(
      id,
      orderId,
      broker,
      payment,
      description,
      0,
      0,
      null,
      null
    )

    const success = await this.repositorioDados.update(
      this.schema,
      id,
      {
        orderId: payments.orderId,
        broker: payments.broker,
        payment: payments.payment,
        description: payments.description
      }
    );

    return success;
  }

  async remove (id: bigint): Promise<any | null> {
    const result = await this.repositorioDados.remove(this.schema, id);

    return result;
  }
}
