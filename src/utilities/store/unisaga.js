export function wrapAction(action) {
    return store => (...params) => run(action, store, params)
}

export async function run(action, store, params = []) {
    if (action && typeof action.next === 'function') {
        return runIterator(action, store)
    }
    if (typeof action !== 'function') {
        const state = await Promise.resolve(action)
        if (state != null) {
            store.setState(state)
        }
        return store.getState()
    }
    const actualState = store.getState()
    const result = await Promise.resolve(action(actualState, ...params))
    return run(result, store)
}


async function runIterator(iterator, store) {
    try {
        let item = iterator.next()
        do {
            let value = await Promise.resolve(item.value)
            if (typeof value === 'function') {
                value = value(store)
            }
            const isRunnable = typeof value === 'function' || typeof value?.next === 'function'
            const nextVal = isRunnable ? await run(value, store) : value
            item = await Promise.resolve(iterator.next(nextVal))
        } while (!item.done)
        return await Promise.resolve(item.value)
    } catch (e) {
        iterator.throw(e)
    }
}
