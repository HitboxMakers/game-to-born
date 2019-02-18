import {h} from '../../state/render'
import {styled} from '../../utilities/style/styled'
import {MediaPreview} from './MediaPreview'
import {SlideshowPreview} from './SlideshowPreview'
import {IframePreview} from './IframePreview'


export const Preview = ({item}) => <PreviewContainer>
    {item && matches(item)}
</PreviewContainer>

const PreviewContainer = styled('section')({
    flex     : '1 1 auto',
    alignSelf: 'stretch',
    position : 'relative',
    overflow : 'hidden',

    '& > *': {
        width : '100%',
        height: '100%',
    },
})

function matches(item) {
    switch (item.type) {
        case 'images':
            return <SlideshowPreview images={item.images}/>
        case 'iframe':
            return <IframePreview url={item.url}/>
        case 'media':
            return <MediaPreview url={item.url} isAudio={item.isAudio}/>
    }
}