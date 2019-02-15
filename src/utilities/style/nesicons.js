import {h} from 'superfine'

export const NesIcon = ({icon, size, transparent}) => <i class={`nes-icon ${icon} is-${size || 'normal'} ${transparent ? 'is-transparent' : ''}`}/>