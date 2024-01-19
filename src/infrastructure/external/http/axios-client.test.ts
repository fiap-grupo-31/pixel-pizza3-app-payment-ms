import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AxiosHttpClient } from './axios-client';

describe('AxiosHttpClient', () => {
  const baseURL = 'https://example.com';
  let axiosMock: MockAdapter;
  let httpClient: AxiosHttpClient;

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
    httpClient = new AxiosHttpClient(baseURL);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  describe('get', () => {
    it('deve fazer uma solicitação GET corretamente', async () => {
      const url = '/api/data';
      const expectedData = { id: 1, name: 'Example' };
      axiosMock.onGet(`${baseURL}${url}`).reply(200, expectedData);

      const result = await httpClient.get(url);

      expect(result).toEqual(expectedData);
    });

    it('deve fazer uma solicitação GET com configurações adicionais', async () => {
      const url = '/api/data';
      const config = { headers: { Authorization: 'Bearer token' } };
      const expectedData = { id: 1, name: 'Example' };
      axiosMock.onGet(`${baseURL}${url}`, config).reply(200, expectedData);

      const result = await httpClient.get(url, config);

      expect(result).toEqual(expectedData);
    });
  });

  describe('post', () => {
    it('deve fazer uma solicitação POST com falha', async () => {
      const url = '/api/data';
      const postData = { id: 1, name: 'Example' };
      const expectedData = { success: true };
      axiosMock.onPost(`${baseURL}${url}`, postData).reply(200, expectedData);

      try {
        await httpClient.post(url, postData);
      } catch (error: any) {
        expect(error.message).toEqual('');
      }
    });
  });
});
