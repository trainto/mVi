const robot = require('../lib/robotjs')

let mouseSpeed = 10 // pixels, 10 is default
let mouseVelocity = 1
let moveCount = 0

let screens = null

function setMonitorsInfo (displays) {
  screens = displays
}

function moveMouse (direction) {
  let mousePos = robot.getMousePos()

  if (moveCount > 10 && mouseVelocity === 1) {
    mouseVelocity *= 20
  }

  let targetX
  let targetY

  switch (direction) {
    case 'left':
      targetX = mousePos.x - (mouseSpeed * mouseVelocity)
      targetY = mousePos.y
      break
    case 'right':
      targetX = mousePos.x + (mouseSpeed * mouseVelocity)
      targetY = mousePos.y
      break
    case 'up':
      targetX = mousePos.x
      targetY = mousePos.y - (mouseSpeed * mouseVelocity)
      break
    case 'down':
      targetX = mousePos.x
      targetY = mousePos.y + (mouseSpeed * mouseVelocity)
      break
    default:
      throw new Error('Direction argument must be left, right, up or down')
  }

  if (_canMoveTo(targetX, targetY)) {
    robot.moveMouseSmooth(targetX, targetY)
    moveCount++
  }
}

function stopMove () {
  moveCount = 0
  mouseVelocity = 1
}

function click () {
  robot.mouseClick()
}

function doubleClick () {
  robot.mouseClick('left', true)
}

function rightClick () {
  robot.mouseClick('right')
}

function _canMoveTo (x, y) {
  let ret = false
  screens.find((screen) => {
    if (x >= screen.bounds.x && x < screen.bounds.x + screen.bounds.width) {
      if (y >= screen.bounds.y && y < screen.bounds.y + screen.bounds.height) {
        ret = true
      }
    }
  })
  return ret
}

module.exports = {
  setMonitorsInfo: setMonitorsInfo,
  moveMouse: moveMouse,
  stopMove: stopMove,
  click: click,
  doubleClick: doubleClick,
  rightClick: rightClick
}
