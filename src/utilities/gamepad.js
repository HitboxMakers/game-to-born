import {Gamepad} from './GamepadAPI'

export const gamepad = new Gamepad()

gamepad.setCustomMapping('keyboard', {
    'button_1'   : 32,
    'select'     : 8,
    'start'      : 13,
    'd_pad_up'   : [
        38,
        87,
    ],
    'd_pad_down' : [
        40,
        83,
    ],
    'd_pad_left' : [
        37,
        65,
    ],
    'd_pad_right': [
        39,
        68,
    ],
})