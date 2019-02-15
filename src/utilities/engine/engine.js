import {h as oldH, patch} from 'superfine'
import {run} from '../store/unisaga'

const startWithOn = /^on/

export const rendererFromStore = (store) => {
    function h(comp, props, ...children) {
        for (let key in props) {
            if (key.match(startWithOn)) {
                const old = props[key]
                props[key] = function (...params) {
                    run(old, store, params)
                        .catch((e) => {
                            console.warn('Crash on ', key, ' props of ', comp?.name || comp)
                            console.error(e)
                        })
                }
            }
        }
        let nextChildren = [].concat(children || props?.children)

        return oldH(comp, props, nextChildren.map(child => typeof child === 'function' ? child(store) : child))
    }

    function render(app, element) {
        let lastNodes = null
        let lastState = null
        let shouldRender = true

        function renderIt() {
            let nextState = store.getState()
            if (lastState === nextState) {
                return
            }
            lastState = nextState
            if (!shouldRender) return
            requestAnimationFrame(() => {
                patch(lastNodes, lastNodes = app(), element)
                shouldRender = true
            })
            shouldRender = false
        }

        store.subscribe(renderIt)
        renderIt()
    }

    function read(...params) {
        const results = params.slice(0, -1).map(fn => fn(store))
        return params[params.length - 1](...results)
    }

    return {
        h,
        render,
        read,
    }
}
