let oMore = document.querySelector('.common-load-more-footer')
// 直至不能获取更多才开始统计数据
let loadMore = () => new Promise((resolve) => {
  let oTimer = setInterval(() => {
    if (oMore.textContent === '加载更多') {
      oMore.scrollIntoView()
    } else {
      clearInterval(oTimer)
      oTimer = null
      resolve()
    }
  }, 2000)
})

let run = async () => {
  await loadMore()
  let oContainer = document.querySelectorAll('.src-pages-content-components-post-item-index-post-item')

  // 节点数据
  let nodeArr = [...oContainer].map((node) => {
    let time = node.querySelector('.src-pages-content-components-post-item-index-time').textContent
    let num = node.querySelector('.src-pages-content-components-post-item-index-stat').querySelectorAll('li')[1].textContent
    return {
      time: time.slice(11).replace(':', ''),
      num: +num.slice(3)
    }
  })

  // 创建类数组对象保存数据
  let collaspObj = {}
  collaspObj.length = 24

  // 整理数据，求每时段平均值 
  nodeArr.forEach(curr => {
    let {
      time,
      num
    } = curr
    // 逢 30 进 1
    let key = ''
    if (+time.slice(2) > 30) {
      key = +time.slice(0, 2) + 1
    } else {
      key = +time.slice(0, 2)
    }
    if (key in collaspObj) {
      collaspObj[key] = parseInt((collaspObj[key] + num) / 2)
    } else {
      collaspObj[key] = num
      collaspObj.length++
    }
  })

  // 寻找最大值
  const MAX_NUM = Math.max(...Array.from(collaspObj).map(v => v ? v : 0))

  let style = {
    time: `padding: 1px 2px; border-radius: 3px 0 0 3px; color: #fff; background: #606060;`,
    even: `padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: #41c12d;`,
    odd: `padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: #9ce290;`,
    num: `padding: 1px 2px; color: #000; background: #fff;`
  }

  // 输出字符串
  let str = '%c 灰色:时间段 %c 绿色:柱形图 %c 数字:平均阅读量 \r\n'
  // 对应字符串样式
  let styleArr = [style.num, style.num, style.num]
  // 通过样式下标控制奇偶样式
  let styleIndex = 0
  Array.from(collaspObj).forEach((num, time) => {
    if (num) {
      const spaceNum = parseInt(30 * num / MAX_NUM)
      const spaceCharacter = Array.from({
        length: spaceNum
      }).map(i => ' ').join('')
      str += `%c ${time < 10 ? '0' + time : time} %c ${spaceCharacter} %c ${num} \r\n`
      styleArr.push(style.time, !(styleIndex % 2) ? style.even : style.odd, style.num)
      styleIndex++
    }
  })

  styleArr.unshift(str)
  console.debug.apply(null, styleArr)
}

run()