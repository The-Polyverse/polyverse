import { describe, it, expect, beforeEach } from 'vitest';
import createDataProvider from './dataProvider';
import { createStore } from '../app/store';

let store: ReturnType<typeof createStore>;
let dataProvider: ReturnType<typeof createDataProvider>;

describe('dataProvider', () => {
  beforeEach(() => {
    store = createStore({
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
    dataProvider = createDataProvider(store);
  });

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
    const result = await dataProvider.create({ resource: 'messages', variables: { id: '3', content: 'Hello World 3' } });
    expect(result.data).toBeDefined();

    expect(result.data.id).toBeDefined();
    expect(result.data.content).toEqual('Hello World 3');
    const count = store.getState().messages.ids.length;
    expect(count).toEqual(3);
  });

  it('updates a message correctly', async () => {
    const result = await dataProvider.update({ resource: 'messages', id: '1', variables: { content: 'Hello World 4' } });
    expect(result.data).toBeDefined();

    expect(result.data.id).toEqual('1');
    expect(result.data.content).toEqual('Hello World 4');
    const message = store.getState().messages.entities['1'];
    expect(message && message.content).toEqual('Hello World 4');
  });

  it('deletes a message correctly', async () => {
    const result = await dataProvider.deleteOne({ resource: 'messages', id: '1' });
    expect(result.data).toBeDefined();
    const count = store.getState().messages.ids.length;
    expect(count).toEqual(1);
    const message = store.getState().messages.entities['1'];
    expect(message).toBeUndefined();
  });

  it('deletes many messages correctly', async () => {
    const result = dataProvider.deleteMany ? await dataProvider.deleteMany({ resource: 'messages', ids: ['1', '2'] }) : null;
    expect(result && result.data).toBeDefined();
    const count = store.getState().messages.ids.length;
    expect(count).toEqual(0);
    const message = store.getState().messages.entities['1'];
    expect(message).toBeUndefined();
  });

  it('returns empty object for unknown resource', async () => {
    const result = await dataProvider.deleteOne({ resource: 'unknown', id: '1' });
    expect(result.data).toEqual({});
  });

  it('returns empty list for unknown resource', async () => {
    const result = dataProvider.deleteMany ? await dataProvider.deleteMany({ resource: 'unknown', ids: [] }) : null;
    expect(result && result.data).toEqual([]);
  });

  it('fetches many messages correctly', async () => {
    const result = dataProvider.getMany ? await dataProvider.getMany({ resource: 'messages', ids: ['1', '2'] }) : null;
    expect(result && result.data).toBeDefined();

    expect(result && result.data.length).toEqual(2);

    expect(result && result.data[0].id).toEqual('1');
    expect(result && result.data[0].content).toEqual('Hello World');

    expect(result && result.data[1].id).toEqual('2');
    expect(result && result.data[1].content).toEqual('Hello World 2');
  });

  it('returns empty list for unknown resource', async () => {
    const result = dataProvider.getMany ? await dataProvider.getMany({ resource: 'unknown', ids: [] }) : null;
    expect(result && result.data).toEqual([]);
  });

  it('creates many messages correctly', async () => {
    const result = dataProvider.createMany ? await dataProvider.createMany({ resource: 'messages', variables: [{ id: '3', content: 'Hello World 3' }] }) : null;
    expect(result && result.data).toBeDefined();

    expect(result && result.data.length).toEqual(1);

    expect(result && result.data[0].id).toBeDefined();
    expect(result && result.data[0].content).toEqual('Hello World 3');
    const count = store.getState().messages.ids.length;
    expect(count).toEqual(3);
  });

  it('updates many messages correctly', async () => {
    const result = dataProvider.updateMany ? await dataProvider.updateMany({ resource: 'messages', ids: ['1', '2'], variables: [{ content: 'Hello World 4' }, { content: 'Hello World 5' }] }) : null;
    expect(result && result.data).toBeDefined();

    expect(result && result.data.length).toEqual(2);

    expect(result && result.data[0].id).toEqual('1');
    expect(result && result.data[0].content).toEqual('Hello World 4');

    expect(result && result.data[1].id).toEqual('2');
    expect(result && result.data[1].content).toEqual('Hello World 5');
    const message1 = store.getState().messages.entities['1'];
    expect(message1 && message1.content).toEqual('Hello World 4');
    const message2 = store.getState().messages.entities['2'];
    expect(message2 && message2.content).toEqual('Hello World 5');
  });
});