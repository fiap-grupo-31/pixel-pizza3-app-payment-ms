import { type HttpClient } from './http-client';

describe('HttpClient Interface', () => {
  let httpClient: HttpClient;

  // Classe Mock para implementar a interface HttpClient
  class MockHttpClient implements HttpClient {
    async get (url: string, config?: any): Promise<any> {
      return await Promise.resolve('GET Response');
    }

    async post (url: string, data: any, config?: any): Promise<any> {
      return await Promise.resolve('POST Response');
    }
  }

  beforeEach(() => {
    httpClient = new MockHttpClient();
  });

  // Teste para verificar se o método get está presente
  it('should have a get method', () => {
    expect(httpClient.get).toBeDefined();
    expect(typeof httpClient.get).toBe('function');
  });

  // Teste para verificar se o método post está presente
  it('should have a post method', () => {
    expect(httpClient.post).toBeDefined();
    expect(typeof httpClient.post).toBe('function');
  });

  // Teste para verificar se o método get retorna uma Promise
  it('get method should return a Promise', () => {
    const result = httpClient.get('https://example.com/api');
    expect(result).toBeInstanceOf(Promise);
  });

  // Teste para verificar se o método post retorna uma Promise
  it('post method should return a Promise', () => {
    const result = httpClient.post('https://example.com/api', {});
    expect(result).toBeInstanceOf(Promise);
  });
});
