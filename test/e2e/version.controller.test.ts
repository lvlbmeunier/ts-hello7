import { getFixtures, IFixtures } from './fixtures';

const pkg: any = require('../../package.json');

describe('Version Routes', () => {
  let fixtures: any;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  afterAll(() => fixtures.release());

  describe('GET /version', () => {
    it('should get version', async () => {
      const { request } = fixtures as IFixtures;
      const { body } = await request.get('/version').expect(200);

      expect(body.description).toBe(pkg.description);
      expect(body.version).toBe(pkg.version);
      expect(body.environment).toBe('test');
    });
  });
});
