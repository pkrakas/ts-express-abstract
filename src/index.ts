import dotenv from 'dotenv'
dotenv.config({
    path: `${__dirname}/../.env`
})

import App from './App'
App.init()