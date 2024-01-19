import { type ParametroBd } from './parametrobd';

describe('ParametroBd Interface', () => {
  it('deve ser uma instância de ParametroBd', () => {
    const parametro: ParametroBd = {
      campo: 'exemploCampo',
      valor: 'exemploValor'
    };

    expect(parametro).toBeDefined();
    expect(parametro.campo).toBe('exemploCampo');
    expect(parametro.valor).toBe('exemploValor');
  });

  it('deve permitir qualquer tipo para o valor', () => {
    const parametroString: ParametroBd = {
      campo: 'teste',
      valor: '1'
    };

    const parametroNumero: ParametroBd = {
      campo: 'teste2',
      valor: 42
    };

    const parametroBooleano: ParametroBd = {
      campo: 'teste3',
      valor: true
    };

    expect(parametroString.valor).toBe('1');
    expect(parametroNumero.valor).toBe(42);
    expect(parametroBooleano.valor).toBe(true);
  });
});
