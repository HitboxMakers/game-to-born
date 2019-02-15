import createStore from 'unistore'
import {Lens} from '../utilities/store/simpleLenses'
import {initializeRouter} from './router'


export const store = createStore({
    route: initializeRouter(),
    home : {
        selected: 0,
    },
    game: {
        selected: 0,
        focus: null,
    },
    games: [
        {
            name     : `Example game`,
            thumbnail: `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
            timeline   : [
                {
                    type: "images",
                    images: [
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`
                    ],
                    label: "Vendredi soir 18h",
                },
                {
                    type: "iframe",
                    url: `/PUDDI_BRAWL_001/`,
                    label: "Samedi matin 8h",
                },
                {
                    type: 'media',
                    url: `https://www.youtube.com/embed/hyFST8UsRUQ?controls=0`,
                    label: "Dimanche soir 17h",
                }
            ],
        },
        {
            name     : `Example game`,
            thumbnail: `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
            timeline   : [
                {
                    type: "images",
                    images: [
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`
                    ],
                    label: "Vendredi soir 18h",
                },
                {
                    type: "iframe",
                    url: `/PUDDI_BRAWL_001/`,
                    label: "Samedi matin 8h",
                },
                {
                    type: 'media',
                    url: `https://www.youtube.com/embed/hyFST8UsRUQ?controls=0`,
                    label: "Dimanche soir 17h",
                }
            ],
        },
        {
            name     : `Example game`,
            thumbnail: `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
            timeline   : [
                {
                    type: "images",
                    images: [
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`
                    ],
                    label: "Vendredi soir 18h",
                },
                {
                    type: "iframe",
                    url: `/PUDDI_BRAWL_001/`,
                    label: "Samedi matin 8h",
                },
                {
                    type: 'media',
                    url: `https://www.youtube.com/embed/hyFST8UsRUQ?controls=0`,
                    label: "Dimanche soir 17h",
                }
            ],
        },
        {
            name     : `Example game`,
            thumbnail: `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
            timeline   : [
                {
                    type: "images",
                    images: [
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`,
                        `https://i.ytimg.com/vi/BSqe-M7ffF8/maxresdefault.jpg`
                    ],
                    label: "Vendredi soir 18h",
                },
                {
                    type: "iframe",
                    url: `/PUDDI_BRAWL_001/`,
                    label: "Samedi matin 8h",
                },
                {
                    type: 'media',
                    url: `https://www.youtube.com/embed/hyFST8UsRUQ?controls=0`,
                    label: "Dimanche soir 17h",
                }
            ],
        },
    ],

})

export const gamesLens = Lens('games')
export const homeLens = Lens('home')
export const gameLens = Lens('game')
export const homeSelectedLens = homeLens.child('selected')
export const gameSelectedLens = gameLens.child('selected')
export const gameFocusLens = gameLens.child('focus')
