import { request } from "./request";

export function getHomeMultidata() {
    return request({
        url: '/home/multidata'
    })
}

// 函数调用 -> 压入函数栈中调用（保存函数调用过程中所有变量）
// 函数调用结束 -> 弹出函数栈（释放函数中所有变量）
// function test() {
// const names = ['why', 'aaa']
// }

// test()

// 如果再调用一次，所有变量重新创建再释放
// test()

export function getHomeGoods(type, page) {
    return request({
        url: '/home/data',
        params: {
            type,
            page
        }
    })
}