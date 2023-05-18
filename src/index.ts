import dotenv from 'dotenv'

dotenv.config({
    path: process.env.NODE_ENV === 'development' ? `${__dirname}/../.env.development`: `${__dirname}/../.env.production`
})

import App from './App'
App.init()