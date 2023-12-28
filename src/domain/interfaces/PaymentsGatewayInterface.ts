import { type Payments } from 'src/domain/entities/Payments';

interface PaymentsGatewayInterface {
  findId: (id: bigint) => Promise<Payments | null>
  find: (Reference: Record<string, any>) => Promise<Payments[] | null>
  findAll: (Reference: Record<string, any>) => Promise<Payments[] | null>
  persist: (
    orderId: string,
    broker: string,
    status: string,
    description: string,
    quantity: number,
    amount: number
  ) => Promise<any>
  update: (
    id: bigint,
    orderId: string,
    broker: string,
    payment: string,
    description: string
  ) => Promise<any>
}

export type { PaymentsGatewayInterface }
