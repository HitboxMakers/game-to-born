import {h} from '../../state/render'
import {styled} from '../../utilities/style/styled'
import {MediaPreview} from './MediaPreview'
import {SlideshowPreview} from './SlideshowPreview'
import {IframePreview} from './IframePreview'


export const Preview = ({item}) => <PreviewContainer>
    {item && matches(item)}
    <div class="left"/>
    <div class="right"/>
    <div class="top"/>
    <div class="bottom"/>
</PreviewContainer>
const size = 60
const PreviewContainer = styled('section')({
    flex                                  : '0 0 auto',
    margin                                : 'auto',
    width                                 : `${size}vw`,
    height                                : `${0.72*size}vw`,
    paddingTop                            : `${0.12*size}vw`,
    paddingBottom                         : `${0.19*size}vw`,
    paddingLeft                           : `${0.16*size}vw`,
    paddingRight                          : `${0.3*size}vw`,
    position                              : 'relative',
    '& > *'                               : {
        width : '100%',
        height: '100%',
    },
    '& .left, & .right, & .top, & .bottom': {
        position        : 'absolute',
        zIndex          : 1,
        background      : `url(${require('./screen.png')})`,
        backgroundSize  : `${size}vw`,
        backgroundRepeat: 'no-repeat',
    },
    '& .left'                             : {
        top   : 0,
        left  : 0,
        bottom: 0,
        width : `${0.18*size}vw`,
        backgroundPosition: 'top left',
    },
    '& .right'                            : {
        top   : 0,
        right : 0,
        bottom: 0,
        width : `${0.32*size}vw`,
        backgroundPosition: 'top right',
    },
    '& .top'                              : {
        top   : 0,
        left  : 0,
        right : 0,
        height: `${0.16*size}vw`,
        backgroundPosition: 'top left',
    },
    '& .bottom'                           : {
        bottom: `${0.048*size}vw`,
        left  : 0,
        right : 0,
        height: `${0.19*size}vw`,
        backgroundPosition: 'bottom left'
    },
})

function matches(item) {
    console.log(item)
    switch (item.type) {
        case 'images':
            return <SlideshowPreview images={item.images}/>
        case 'iframe':
            return <IframePreview url={item.url}/>
        case 'media':
            return <MediaPreview url={item.url} isAudio={item.isAudio}/>
    }
}