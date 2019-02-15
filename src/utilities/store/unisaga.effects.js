import {Lens} from './simpleLenses'

export function call(action, ...params) {
    return store => store.action(action)(...params)
}

export function update(state) {
    return store => store.setState(state)
}

export function get(path) {
    const lens = typeof path === 'object' ? path : Lens(path)
    return store => lens.get()(store.getState())
}

export function put(path, update) {
    const lens = typeof path === 'object' ? path : Lens(path)
    return store => store.setState(
        lens.set(update)(store.getState())
    )
}
