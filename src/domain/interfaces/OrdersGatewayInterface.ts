import { type Orders } from 'src/domain/entities/Orders';

interface OrdersGatewayInterface {
  findId: (orderId: string) => Promise<Orders | null>
  find: (Reference: Record<string, any>) => Promise<Orders[] | null>
  remove: (id: bigint) => Promise<any | null>
  findAll: () => Promise<Orders[] | null>
  persist: (
    orderId: string | null,
    broker: string | null,
    payment: string | null
  ) => Promise<any>
  update: (
    id: bigint,
    payment: string | null
  ) => Promise<any>
}

export type { OrdersGatewayInterface }
