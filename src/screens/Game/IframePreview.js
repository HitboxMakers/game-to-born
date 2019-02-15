import {styled} from '../../utilities/style/styled'
import {h} from '../../state/render'
import {put} from '../../utilities/store/unisaga.effects'
import {gameFocusLens} from '../../state/store'


export const IframePreview = ({url}) => <IframePreviewContainer src={url} frameborder="0" oncreate={attachFocusOut}/>

const IframePreviewContainer = styled('iframe')({
    margin: 'auto',
    width : '50vh',
    height: '50vh',
})

function* attachFocusOut(state, elm) {
    elm.focus()
    yield new Promise((resolve) => {
        elm.contentWindow.addEventListener('keydown', (event) => {
            if(event.code === "Escape") {
                resolve()
            }
        }, false)
    })
    window.focus()
    yield put(gameFocusLens, null)
}