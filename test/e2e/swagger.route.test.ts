import assert from 'assert';
import { getFixtures, IFixtures } from './fixtures';

describe('Swagger Routes', () => {
  let fixtures: any;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  afterAll(() => fixtures.release());

  describe('GET /swagger', () => {
    it('should return 401 if no basic auth is provided', async () => {
      const { request } = fixtures as IFixtures;
      const { body, status } = await request.get('/swagger/');
      assert.equal(status, 401, JSON.stringify(body, null, 2));
    });

    it('should return 200 with basic auth', async () => {
      const { request } = fixtures as IFixtures;
      const { body, status } = await request.get('/swagger/').auth('admin', '1234');
      assert.equal(status, 200, JSON.stringify(body, null, 2));
    });
  });
});
