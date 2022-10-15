import { extendBaseCommand } from '../extend-base-command';

describe('extendBaseCommand.ts test', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it.skip('UPDATE ME', async () => {
    // Act
    const result = await extendBaseCommand();

    // Assert
    expect(result).toBeUndefined();
  });
});
