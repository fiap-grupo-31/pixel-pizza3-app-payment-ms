/* eslint-disable @typescript-eslint/naming-convention */
export class Payments {
  private readonly _id: any;
  private readonly _orderId: string;
  private readonly _broker: string;
  private readonly _payment: string;
  private readonly _description: string;
  private readonly _quantity: number;
  private readonly _amount: number;
  private readonly _created_at: Date;
  private readonly _updated_at: Date;

  constructor (
    id: any,
    orderId: string,
    broker: string,
    payment: string,
    description: string,
    quantity: number,
    amount: number,
    created_at: any,
    updated_at: any
  ) {
    this._id = id;
    this._orderId = orderId || '';
    this._broker = broker || '';
    this._payment = payment || '';
    this._description = description || '';
    this._quantity = quantity;
    this._amount = amount || 0;
    this._created_at = created_at || '';
    this._updated_at = updated_at || '';
  }

  get orderId (): string {
    return this._orderId;
  }

  get id (): bigint {
    return this._id;
  }

  get broker (): string {
    return this._broker;
  }

  get payment (): string {
    return this._payment;
  }

  get description (): string {
    return this._description;
  }

  get quantity (): number {
    return this._quantity;
  }

  get amount (): number {
    return this._amount;
  }

  get paymentCheck (): boolean {
    return [
      'WAITING', // AGUARDANDO
      'APPROVED', // APROVADO
      'DENIED', // NEGADO
      'CANCELED' // NEGADO
    ].includes(this._payment);
  }

  get created_at (): Date {
    return this._created_at;
  }

  get updated_at (): Date {
    return this._updated_at;
  }
}
