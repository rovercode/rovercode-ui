import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchTags } from '../tag';


describe('Tag actions', () => {
  test('fetch all tags', async () => {
    const mock = new MockAdapter(axios);
    const tags = [{
      name: 'tag1',
    }, {
      name: 'tag2',
    }];

    mock.onGet('/api/v1/tags/').reply(200, tags);

    const action = fetchTags();
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('FETCH_TAGS');
    expect(payload).toEqual(tags);
    mock.restore();
  });
});
