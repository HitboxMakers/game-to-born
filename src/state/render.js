import {rendererFromStore} from '../utilities/engine/engine'
import {store} from './store'
import {get} from '../utilities/store/unisaga.effects'


const {h: stateH, render: stateRender, read: stateRead,} = rendererFromStore(store)

export const h = stateH
export const render = stateRender
export const read = stateRead
export const connect = (lenses) => (render) => {
    const intermediateState = (props) => (store) => Object.keys(lenses).reduce((acc, key) => {
        const lens = lenses[key]
        return ({
            ...acc,
            [key]: get(typeof lens === "function" ? lens(props) : lens)(store),
        })
    }, {})
    return (props) => read(intermediateState(props), render)
}