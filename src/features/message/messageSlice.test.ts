import { describe, expect, it } from 'vitest';
import createMessagesSlice from './messageSlice';

const { reducer, actions: {
  addMessage,
  updateMessage,
  removeMessage,
  addMessages,
  updateMessages,
  removeMessages,
} } = createMessagesSlice();

describe('messageSlice', () => {
  it('addMessge', () => {
    const state = reducer(undefined, addMessage({ id: '1', content: 'Hello' }))
    expect(state.entities['1']).toEqual({ id: '1', content: 'Hello' })
  });

  it('updateMessage', () => {
    const state = reducer({ ids: ['1'], entities: { '1': { id: '1', content: 'Hello' } } }, updateMessage({ id: '1', changes: { content: 'Hi' } }))
    expect(state.entities['1']).toEqual({ id: '1', content: 'Hi' })
  });

  it('removeMessage', () => {
    const state = reducer({ ids: ['1'], entities: { '1': { id: '1', content: 'Hello' } } }, removeMessage('1'))
    expect(state.entities['1']).toBeUndefined()
  });

  it('addMessages', () => {
    const state = reducer(undefined, addMessages([{ id: '1', content: 'Hello' }]))
    expect(state.entities['1']).toEqual({ id: '1', content: 'Hello' })
  });

  it('updateMessages', () => {
    const state = reducer({ ids: ['1'], entities: { '1': { id: '1', content: 'Hello' } } }, updateMessages([{ id: '1', changes: { content: 'Hi' } }]))
    expect(state.entities['1']).toEqual({ id: '1', content: 'Hi' })
  });

  it('removeMessages', () => {
    const state = reducer({ ids: ['1'], entities: { '1': { id: '1', content: 'Hello' } } }, removeMessages(['1']))
    expect(state.entities['1']).toBeUndefined()
  });
});