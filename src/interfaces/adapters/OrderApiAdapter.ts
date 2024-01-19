import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

export interface OrderApiAdapterInterface {
  updatePaymentOrder: (orderId: string, status: string) => Promise<boolean>
}

export class OrderApiAdapter implements OrderApiAdapterInterface {
  private readonly axiosInstance: AxiosInstance;

  constructor (baseURL: string, instance: any) {
    this.axiosInstance = (!instance
      ? axios.create({
        baseURL
      })
      : instance);
  }

  async updatePaymentOrder (orderId: string, payment: string): Promise<boolean> {
    try {
      const response: AxiosResponse = await this.axiosInstance.put(`/orders/${orderId}/payment`, {
        payment
      });

      if (response.status !== 200) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
