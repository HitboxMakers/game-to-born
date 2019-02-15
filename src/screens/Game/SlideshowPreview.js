import Siema from 'siema'
import {h} from '../../state/render'
import {put} from '../../utilities/store/unisaga.effects'
import {gameFocusLens} from '../../state/store'
import {styled} from '../../utilities/style/styled'


export const SlideshowPreview = ({images}) => <SiemaContainer>
    <div
        oncreate={subscribe}
        ondestroy={unsubscribe}>
    >
        {
            images.map(src => <img src={src} alt="preview"/>)
        }
    </div>
</SiemaContainer>

const SiemaContainer = styled('div')({
    '& *'  : {
        height: '100%',
    },
    '& img': {
        height        : '100%',
        width         : '100%',
        objectFit     : 'cover',
        objectPosition: 'center center',
    },
})

const map = new WeakMap()

function* subscribe(state, elm) {
    console.log('siema', elm)
    const player = new Siema({
        selector: elm,
        loop    : true,
        onInit  : next,
        onChange: next,
    })
    map.set(elm, player)

    yield new Promise((resolve) => {
        const listener = (event) => {
            if (event.code === 'Escape') {
                window.removeEventListener('keydown', listener, false)
                resolve()
            }
        }
        window.addEventListener('keydown', listener, false)
    })
    yield put(gameFocusLens, null)

    function next() {
        setTimeout(() => player.next(), 3000)
    }
}

function unsubscribe(state, elm) {
    const player = map.get(elm)
    player && player.destroy()
}