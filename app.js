import Koa from 'koa'
import server from 'koa-static'
import {
    resolve
} from 'path'
import * as R from 'ramda'
import {
    initAdmin
} from './server/admin'

const MIDDLEWARES = ['exception', 'common', 'router']
const useMiddlewares = app => {
    R.map(
        R.compose(
            R.forEachObjIndexed(
                initWidth => initWidth(app)
            ),
            require,
            name => {
                resolve(__dirname, `./middlewares/${name}`)
            }
        )
    )(MIDDLEWARES)
}

async function start() {
    const app = new Koa()
    await useMiddlewares(app)
    // 初始化管理员数据
    initAdmin({
        username: 'scott',
        password: '123',
        role: 0
    })
    // 设置静态目录
    app.use(server(resolve(__dirname, '../public')))
    app.listen('3000')
}
start()