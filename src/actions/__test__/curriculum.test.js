import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchCourses } from '../curriculum';


describe('Curriculum actions', () => {
  test('fetch all courses', (done) => {
    const mock = new MockAdapter(axios);
    const courses = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 1,
        name: 'Test',
        description: 'This is a test',
        lessons: [{
          id: 1,
          reference: 'Lesson1',
          description: 'The first lesson',
          sequence_number: 1,
          state: {
            progress: 'IN_PROGRESS',
          },
        }, {
          id: 2,
          reference: 'Lesson2',
          description: 'The second lesson',
          sequence_number: 1,
          state: {
            progress: 'AVAILABLE',
          },
        }],
      }],
    };

    mock.onGet('/api/v1/courses/').reply(200, courses);

    const action = fetchCourses();
    const { type } = action;
    expect(type).toEqual('FETCH_COURSES');
    action.payload.then((result) => {
      expect(result).toEqual(courses);
      mock.restore();
      done();
    });
  });
});
