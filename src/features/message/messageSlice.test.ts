import { expect, test } from 'vitest';
import createMessageSlice from './messageSlice';

const { reducer, actions: { addMessage, updateMessage, removeMessage } } = createMessageSlice();

test('addMessage', () => {
    const state = reducer(undefined, addMessage({ id: '1', content: 'Hello' }))
    expect(state.entities['1']).toEqual({ id: '1', content: 'Hello' })
})

test('updateMessage', () => {
    const state = reducer({ ids: ['1'], entities: { '1': { id: '1', content: 'Hello' } } }, updateMessage({ id: '1', changes: { content: 'Hi' } }))
    expect(state.entities['1']).toEqual({ id: '1', content: 'Hi' })
})

test('removeMessage', () => {
    const state = reducer({ ids: ['1'], entities: { '1': { id: '1', content: 'Hello' } } }, removeMessage('1'))
    expect(state.entities['1']).toBeUndefined()
})