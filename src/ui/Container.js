import {h} from '../state/render'
import cc from 'classcat'

export const ContainerWithTitle = (props) => <article {...props} class={cc([
    props.class,
    'nes-container with-title',
])}/>
export const ContainerTitle = (props) => <h1 {...props} class={cc([
    props.class,
    'title',
])}/>