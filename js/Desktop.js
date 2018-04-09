/* jshint asi: true, browser: true, expr: true, node: true, esversion: 6 */

'use strict'

const desktopBase = {

  /**
   * Function to initialize the event listeners
   */
  initEventListeners: function () {
    document.addEventListener('click', this.onClick.bind(this))
    document.querySelector('#desktop').addEventListener('mousedown', this.mouseDown.bind(this))
  },

  /**
   * Function to handle the mouse click events
   */
  onClick: function (event) {
    if (event.target.nodeName === document.body.parentElement.nodeName) {
      document.activeElement.blur()

      let active = document.querySelectorAll('#desktop .active')

      for (let i = 0; i < active.length; i++) {
        active[i].classList.toggle('active')
      }
    }
  },

  /**
   * Function to handle the mouse down events
   */
  mouseDown: function (event) {
    if (this.buttonPressed(event, 1)) {
      event.stopPropagation()
      event.preventDefault()
      let id = this.getWindowID(event.target)
      let windowElement = document.querySelector(`#${id}`)
      this.bringToFront(windowElement)
      this.activateFocus(windowElement)

      if (event.target.parentElement.parentElement.classList.contains('window-title')) {
        this.doWindowTitleAction(windowElement, event.target)
      // } else if (event.target.classList.contains('resizer:not(.disabled)')) { // TODO: Fix the resizer!
      } else if (event.target.parentElement.classList.contains('menuMemory')) {
        if (event.target.classList.contains('play')) {
          let boardSize = windowElement.querySelector('.memoryContainer').getAttribute('board-size')
          if (boardSize === '4x4') {
            windowElement.style.height = 550 + 'px'
            windowElement.style.width = 496 + 'px'
          } else if (boardSize === '4x2') {
            windowElement.style.height = 550 + 'px'
            windowElement.style.width = 248 + 'px'
          } else if (boardSize === '2x4') {
            windowElement.style.height = 296 + 'px'
            windowElement.style.width = 496 + 'px'
          } else {
            windowElement.style.height = 296 + 'px'
            windowElement.style.width = 248 + 'px'
          }
        }
      } else {
        if (event.target.parentElement.classList.contains('window-title')) {
          if (!windowElement.classList.contains('maximized')) {
            this.dragElement(windowElement, event.target)
            event.target.onmousedown()
          }
        }
      }
    }
  },

  /**
   * Function to traverse up the DOM untill it finds the window element and then gets that id
   * @param {DOMelement} element A element
   */
  getWindowID: function (element) {
    let el = element
    let found = false
    while (!found) {
      if (el.classList.contains('window-frame')) {
        found = true
      } else {
        el = el.parentNode
      }
    }
    return el.id
  },

  /**
   * Function to handle the window standard buttons like minimize, maximize and close
   * @param {DOMelement} windowElement The window element
   * @param {DOMelement} eventTarget The button element
   */
  doWindowTitleAction: function (windowElement, eventTarget) {
    if (eventTarget.classList.contains('disabled')) { return }
    let classes = eventTarget.className.split(/\s+/)
    for (let i = 0; i < classes.length; i++) {
      if (classes[i].search('close') > -1) {
        windowElement.remove()
      } else if (classes[i].search('maximize') > -1) {
        windowElement.classList.add('maximized')
        windowElement.classList.remove('restored')
        eventTarget.classList.add('sprite-restore-black')
        eventTarget.classList.remove('sprite-maximize-black')
      } else if (classes[i].search('restore') > -1) {
        windowElement.classList.add('restored')
        windowElement.classList.remove('maximized')
        eventTarget.classList.add('sprite-maximize-black')
        eventTarget.classList.remove('sprite-restore-black')
        setTimeout(() => {
          windowElement.classList.remove('restored')
        }, 123)
      } else if (classes[i].search('minimize') > -1) { // TODO: Fix the minimizer!
        // windowElement.classList.toggle('minimized')
      }
    }
  },

  /**
   * Checks that the mouse button is pressed
   * @param {event} event The event
   * @param {int} button What button to check
   */
  buttonPressed: function (event, button) {
    if (event.buttons === null) {
      return event.which === button
    } else {
      return event.buttons === button
    }
  },

  /**
   * Allows draging of the element
   * @param {DOMelement} windowElement The window element
   * @param {DOMelement} eventTarget The event target
   */
  dragElement: function (windowElement, eventTarget) {
    let diffX = 0
    let diffY = 0
    let prevX = 0
    let prevY = 0
    let nextX = 0
    let nextY = 0

    let rect = windowElement.getBoundingClientRect()
    let width = rect.width
    let height = rect.height
    let windowWidth = window.innerWidth
    let windowHeight = window.innerHeight

    eventTarget.onmousedown = dragMouseDown

    function dragMouseDown (event) {
      event = event || window.event
      document.onmouseup = closeDragElement
      prevX = event.clientX
      prevY = event.clientY
      document.onmousemove = elementDrag
    }

    function elementDrag (event) {
      event = event || window.event
      diffX = prevX - event.clientX
      diffY = prevY - event.clientY
      prevX = event.clientX
      prevY = event.clientY
      nextX = windowElement.offsetLeft - diffX
      nextY = windowElement.offsetTop - diffY
      if (checkBoundaries()) {
        windowElement.style.left = nextX + 'px'
        windowElement.style.top = nextY + 'px'
      } else if (!checkBoundaries('left')) {
        windowElement.style.left = 1 + 'px'
      } else if (!checkBoundaries('top')) {
        windowElement.style.top = 1 + 'px'
      } else if (!checkBoundaries('right')) {
        windowElement.style.left = windowWidth - width - 1 + 'px'
      } else if (!checkBoundaries('bottom')) {
        windowElement.style.top = windowHeight - 52 - height - 1 + 'px'
      }
    }

    function checkBoundaries (directions) {
      let left = nextX
      let top = nextY
      let right = nextX + width
      let bottom = nextY + height

      if (directions === 'left') {
        return (left > 1)
      } else if (directions === 'top') {
        return (top > 1)
      } else if (directions === 'right') {
        return (right + 1 < windowWidth)
      } else if (directions === 'bottom') {
        return (bottom + 52 + 1 < windowHeight)
      } else {
        return (left > 0 && top > 0 && right + 1 < windowWidth && bottom + 52 + 1 < windowHeight)
      }
    }

    function closeDragElement () {
      document.onmousemove = null
      eventTarget.onmousedown = null
      document.onmouseup = null
    }
  },

  /**
   * Adding the window element to desktop DOM
   * @param {Object} windowObject The window object
   */
  populateDesktop: function (windowObject) {
    let element = windowObject.windowElement
    element.style.left = X(windowObject.width) + 'px'
    element.style.top = Y(windowObject.height) + 'px'
    element.style.zIndex = Z(element)
    document.querySelector('#desktop').appendChild(element)
    let windowElement = document.querySelector(`#${element.id}`)
    this.bringToFront(windowElement)
    this.activateFocus(windowElement)
  },

  /**
   * Sets the z-index to the highest
   * @param {DOMelement} windowElement The window element
   */
  bringToFront: function (windowElement) {
    windowElement.style.zIndex = Z(windowElement)
  },

  /**
   * Set focus to the window element
   * @param {DOMelement} windowElement The window element
   */
  activateFocus: function (windowElement) {
    document.activeElement.blur()

    let active = document.querySelectorAll('#desktop .active')

    for (let i = 0; i < active.length; i++) {
      active[i].classList.toggle('active')
    }
    windowElement.querySelector('.window-title').classList.toggle('active')

    let elements = windowElement.querySelectorAll('.window-content *')
    for (let i = 0; i < elements.length; i++) {
      elements[i].focus()
      if (!(document.activeElement === document.querySelector('body') || document.activeElement === null)) {
        return
      }
    }
  },

  /**
   * Reset the cordinate counters
   */
  resetXYZ: function () {
    X('', true)
    Y('', true)
    Z('', true)
  }
}

/**
 * Constructor for the Desktop
 * @constructor
 */
let Desktop = function () {
  return Object.create(desktopBase, {
  })
}

/**
 * Static function for the X cordinate
 * @param {int} width The window width
 * @param {boolean} reset
 * @return {int} The X cordinate
 */
function X (width, reset) {
  let n = 25

  if (reset) {
    X.counter = n
    X.no = 1
  } else {
    if (typeof X.counter === 'undefined') {
      X.counter = n
      X.no = 1
    }

    X.counter += n

    if ((X.counter + width) > window.innerWidth) {
      X.no++
      X.counter = n * X.no
    }

    return X.counter
  }
}

/**
 * Static function for the Y cordinate
 * @param {int} height The window height
 * @param {boolean} reset
 * @return {int} The Y cordinate
 */
function Y (height, reset) {
  let n = 25

  if (reset) {
    Y.counter = n
    Y.no = 1
  } else {
    if (typeof Y.counter === 'undefined') {
      Y.counter = n
      Y.no = 1
    }

    Y.counter += n

    if ((Y.counter + height) > window.innerHeight) {
      Y.no++
      Y.counter = n * Y.no
    }

    return Y.counter
  }
}

/**
 * Static function for the Z cordinate
 * @param {DOMelement} element The window element
 * @param {boolean} reset
 * @return {int} The Z cordinate
 */
function Z (element, reset) {
  if (reset) {
    Z.counter = 0
  } else {
    if (typeof Z.counter === 'undefined') {
      Z.counter = 0
    }
    if (element !== 'undefined' && parseInt(element.style.zIndex) === Z.counter) {
      return Z.counter
    } else {
      return ++Z.counter
    }
  }
}

module.exports = Desktop
