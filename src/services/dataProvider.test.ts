import { describe, it, expect } from 'vitest';
import createDataProvider from './dataProvider';
import { createStore } from '../app/store';


const store = createStore({
  messages: {
    ids: [
      '1',
      '2',
    ], entities: {
      1: { id: '1', content: 'Hello World' },
      2: { id: '2', content: 'Hello World 2' },
    }
  }
});
const dataProvider = createDataProvider(store);

describe('dataProvider', () => {
  it('fetches list of messages correctly', async () => {
    const result = await dataProvider.getList({ resource: 'messages' });
    expect(result.data).toBeDefined();
    expect(result.total).toBeDefined();

    expect(result.data.length).toEqual(2);
    expect(result.total).toEqual(2);

    expect(result.data[0].id).toEqual('1');
    expect(result.data[0].content).toEqual('Hello World');

    expect(result.data[1].id).toEqual('2');
    expect(result.data[1].content).toEqual('Hello World 2');
  });

  it('returns empty list for unknown resource', async () => {
    const result = await dataProvider.getList({ resource: 'unknown' });
    expect(result.data).toEqual([]);
    expect(result.total).toEqual(0);
  });

  it('fetches a single message correctly', async () => {
    const result = await dataProvider.getOne({ resource: 'messages', id: '1' });
    expect(result.data).toBeDefined();

    expect(result.data.id).toEqual('1');
    expect(result.data.content).toEqual('Hello World');
  });

  it('returns empty object for unknown resource', async () => {
    const result = await dataProvider.getOne({ resource: 'unknown', id: '1' });
    expect(result.data).toEqual({});
  });

  it('creates a message correctly', async () => {
    const result = await dataProvider.create({ resource: 'messages', variables: { content: 'Hello World 3' } });
    expect(result.data).toBeDefined();

    expect(result.data.id).toBeDefined();
    expect(result.data.content).toEqual('Hello World 3');
  });

  it('updates a message correctly', async () => {
    const result = await dataProvider.update({ resource: 'messages', id: '1', variables: { content: 'Hello World 4' } });
    expect(result.data).toBeDefined();

    expect(result.data.id).toEqual('1');
    expect(result.data.content).toEqual('Hello World 4');
  });

  it('deletes a message correctly', async () => {
    const result = await dataProvider.deleteOne({ resource: 'messages', id: '1' });
    expect(result.data).toBeDefined();
  });
});