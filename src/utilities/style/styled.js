import {css} from 'emotion'
import {h} from 'superfine'
import cc from 'classcat'


export function styled(comp) {
    return function (...props) {
        const fixeds = props.filter(f => typeof f !== "function")
        const dynamics = props.filter(f => typeof f === "function")
        const generatedClass = css(...fixeds)

        const generatedComponent = (props) => {
            const dynamicStyle = css(...dynamics.map(f => f(props)))
            return h(comp, {...props, class: cc([props.class, generatedClass, dynamicStyle])})
        }

        generatedComponent.staticSelector = `.${generatedClass}`
        return generatedComponent
    }
}
