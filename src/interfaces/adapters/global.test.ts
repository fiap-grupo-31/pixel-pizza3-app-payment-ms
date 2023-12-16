import { Global } from './global';

describe('Global', () => {
  describe('error function', () => {
    it('should return a success response: any with statusCode 200 when data is null', () => {
      const response: any = Global.error(null);
      expect(response.statusCode).toBe(200);
      expect(response.status).toBe('success');
      expect(response.data).toEqual([]);
    });

    it('should return an error response: any with statusCode 404 when data is provided', () => {
      const response: any = Global.error('Not found');
      expect(response.statusCode).toBe(404);
      expect(response.status).toBe('error');
      expect(response.message).toBe('Not found');
    });
  });

  describe('success function', () => {
    it('should return a success response: any with statusCode 200 when data is null', () => {
      const response: any = Global.success(null);
      expect(response.statusCode).toBe(200);
      expect(response.status).toBe('success');
      expect(response.data).toEqual([]);
    });

    it('should return a success response: any with statusCode 200 when data is provided', () => {
      const response: any = Global.success({ key: 'value' });
      expect(response.statusCode).toBe(200);
      expect(response.status).toBe('success');
      expect(response.data).toEqual({ key: 'value' });
    });
  });

  describe('convertToObject function', () => {
    it('should return an empty object when data is null', () => {
      const response: any = Global.convertToObject(null);
      expect(response).toEqual({});
    });

    it('should parse JSON string data into an object', () => {
      const jsonData = '{"key": "value"}';
      const response: any = Global.convertToObject(jsonData);
      expect(response).toEqual({ key: 'value' });
    });

    it('should return an empty object when parsing fails', () => {
      const invalidData = 'invalidJSON';
      const response: any = Global.convertToObject(invalidData);
      expect(response).toEqual({});
    });
  });
});
