import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/project/[id]';
import { describe, test, expect } from 'vitest';

describe('/api/project/[id]', () => {
  test('returns a 200 status and project data', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: { 'x-session': JSON.stringify({ userId: '1' }) },
      query: { id: 'c108c683-4338-4ef8-89e8-20ac7c7b62dd' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      areas: [
        {
          id: '069f2fc0-0431-4ae8-b3d6-02da84e39006',
          tasks: [
            {
              createdAt: '2025-09-19',
              tags: [],
              taskId: '2613ff82-0c3e-4d27-9783-2a439ddfdac8',
              taskOwner: 'Bob',
              text: 'Some tesk note',
            },
            {
              createdAt: '2025-09-19',
              tags: [],
              taskId: '2eb6c627-2f0a-4ce9-8279-f22988bb3500',
              taskOwner: 'Bob',
              text: 'One more task',
            },
            {
              createdAt: '2025-09-19',
              tags: [],
              taskId: '61ef462f-209b-4917-ada0-9af17aac3902',
              taskOwner: 'Bob',
              text: 'New task',
            },
          ],
          title: 'DONE',
        },
        {
          id: 'bb68b034-33a7-4076-9c2b-8c9b0504fbcf',
          tasks: [
            {
              createdAt: '2025-04-09T15:22:42.491Z',
              tags: [],
              taskId: '47ed0bed-3013-433d-b074-a124bfd7157d',
              taskOwner: '1',
              text: 'Ipsum reiciendis labore cupiditate, vir.',
            },
            {
              createdAt: '2025-09-19',
              tags: [],
              taskId: 'eca22e42-7543-4b88-b5fd-50e2933754f8',
              taskOwner: 'Bob',
              text: 'Test something 2',
            },
          ],
          title: 'IN PROGRESS',
        },
        {
          id: 'f181c360-e37e-434e-87db-c5a2d49ff395',
          tasks: [
            {
              createdAt: '2024-08-26T13:04:34.934Z',
              tags: [],
              taskId: '2aae2d14-4915-4c31-8ca9-1f80be1b2710',
              taskOwner: '1',
              text: 'Sed esse occaecati facilis possimus ulm.',
            },
            {
              createdAt: '2024-12-09T07:35:52.510Z',
              tags: [],
              taskId: '9f541e60-0d46-4005-94c2-9dae97a75a72',
              taskOwner: '1',
              text: 'Fugiat maiores eos quasi consequuntur r.',
            },
            {
              createdAt: '2023-10-31T02:52:56.178Z',
              tags: [],
              taskId: 'bdac419c-3331-480f-a084-0d1b14eb5b19',
              taskOwner: '1',
              text: 'Fugiat neque occaecati eos et exercitaw.',
            },
            {
              createdAt: '2025-01-01T01:49:49.175Z',
              tags: [],
              taskId: 'de2930cd-274b-4d54-9a06-72f255b3dbad',
              taskOwner: '1',
              text: 'Laborum tenetur ipsum ducimus magnam io.',
            },
          ],
          title: 'TODO',
        },
      ],
      createdAt: '2025-04-04T02:14:22.325Z',
      id: 'c108c683-4338-4ef8-89e8-20ac7c7b62dd',
      isFavorite: null,
      roleName: 'OWNER',
      tags: [],
      title: 'Merchant Holistic',
      userId: '1',
      userRole: 'OWNER',
      username: 'bob',
    });
  });

  test('returns a 400 status and project data', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: { 'x-session': JSON.stringify({ userId: '1' }) },
      query: { id: 'c108c683-4338-4ef8-89e8-20ac7c7b62dd' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      areas: [
        {
          id: '069f2fc0-0431-4ae8-b3d6-02da84e39006',
          tasks: [
            {
              createdAt: '2025-09-19',
              tags: [],
              taskId: '2613ff82-0c3e-4d27-9783-2a439ddfdac8',
              taskOwner: 'Bob',
              text: 'Some tesk note',
            },
            {
              createdAt: '2025-09-19',
              tags: [],
              taskId: '2eb6c627-2f0a-4ce9-8279-f22988bb3500',
              taskOwner: 'Bob',
              text: 'One more task',
            },
            {
              createdAt: '2025-09-19',
              tags: [],
              taskId: '61ef462f-209b-4917-ada0-9af17aac3902',
              taskOwner: 'Bob',
              text: 'New task',
            },
          ],
          title: 'DONE',
        },
        {
          id: 'bb68b034-33a7-4076-9c2b-8c9b0504fbcf',
          tasks: [
            {
              createdAt: '2025-04-09T15:22:42.491Z',
              tags: [],
              taskId: '47ed0bed-3013-433d-b074-a124bfd7157d',
              taskOwner: '1',
              text: 'Ipsum reiciendis labore cupiditate, vir.',
            },
            {
              createdAt: '2025-09-19',
              tags: [],
              taskId: 'eca22e42-7543-4b88-b5fd-50e2933754f8',
              taskOwner: 'Bob',
              text: 'Test something 2',
            },
          ],
          title: 'IN PROGRESS',
        },
        {
          id: 'f181c360-e37e-434e-87db-c5a2d49ff395',
          tasks: [
            {
              createdAt: '2024-08-26T13:04:34.934Z',
              tags: [],
              taskId: '2aae2d14-4915-4c31-8ca9-1f80be1b2710',
              taskOwner: '1',
              text: 'Sed esse occaecati facilis possimus ulm.',
            },
            {
              createdAt: '2024-12-09T07:35:52.510Z',
              tags: [],
              taskId: '9f541e60-0d46-4005-94c2-9dae97a75a72',
              taskOwner: '1',
              text: 'Fugiat maiores eos quasi consequuntur r.',
            },
            {
              createdAt: '2023-10-31T02:52:56.178Z',
              tags: [],
              taskId: 'bdac419c-3331-480f-a084-0d1b14eb5b19',
              taskOwner: '1',
              text: 'Fugiat neque occaecati eos et exercitaw.',
            },
            {
              createdAt: '2025-01-01T01:49:49.175Z',
              tags: [],
              taskId: 'de2930cd-274b-4d54-9a06-72f255b3dbad',
              taskOwner: '1',
              text: 'Laborum tenetur ipsum ducimus magnam io.',
            },
          ],
          title: 'TODO',
        },
      ],
      createdAt: '2025-04-04T02:14:22.325Z',
      id: 'c108c683-4338-4ef8-89e8-20ac7c7b62dd',
      isFavorite: null,
      roleName: 'OWNER',
      tags: [],
      title: 'Merchant Holistic',
      userId: '1',
      userRole: 'OWNER',
      username: 'bob',
    });
  });
});
