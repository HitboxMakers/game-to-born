import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import {h} from '../../state/render'
import {gameFocusLens} from '../../state/store'
import {put} from '../../utilities/store/unisaga.effects'
import {styled} from '../../utilities/style/styled'
export const MediaPreview = ({url, isAudio}) => {
    const sharedProps = {
        oncreate : subscribe,
        ondestroy: unsubscribe,
    }
    if (url.includes('youtube') || url.includes('vimeo')) {
        return <Container {...sharedProps} class="plyr__video-embed">
            <iframe src={url} allow="autoplay"/>
        </Container>
    } else if (isAudio) {
        return <audio {...sharedProps}>
            <source src={url} type={'audio/' + url.split('.').slice(-1)[0]}/>
        </audio>
    } else {
        return <video {...sharedProps}>
            <source src={url} type={'video/' + url.split('.').slice(-1)[0]}/>
        </video>
    }
}

const Container = styled('div')({
    paddingBottom: '75% !important'
})

const map = new WeakMap()

function* subscribe(state, elm) {
    const player = new Plyr(elm, {
        autoplay: true,
        ratio: "4:3",
    })
    player.on('ready', () => {
        return player.play()
    })
    map.set(elm, player)
    yield new Promise((resolve) => {
        const listener = (event) => {
            if (event.code === "Escape") {
                window.removeEventListener('keydown', listener, false)
                resolve()
            }
        }
        window.addEventListener('keydown', listener, false)
    })
    yield put(gameFocusLens, null)
}

function unsubscribe(state, elm) {
    const player = map.get(elm)
    player && player.destroy()
}