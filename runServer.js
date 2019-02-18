const bs = require('browser-sync').create()

bs.init({
    watch : true,
    single: true,
    server: './docs',
})

