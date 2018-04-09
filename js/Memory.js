/* jshint asi: true, browser: true, expr: true, node: true, esversion: 6 */

'use strict'

const memoryBase = {

  /**
   * Function to set the basics
   * @param {String} id The uniq id for the window element
   */
  set: function (id) {
    this.ID = id
    this.windowElement = document.querySelector(`#${this.ID}`)
    this.memoryContainer = this.windowElement.querySelector('.memoryContainer')
    this.victoryContainer = this.memoryContainer.querySelector('.victory')
    this.buttonContainer = this.memoryContainer.querySelector('.btn-group')
    this.brickContainer = this.memoryContainer.querySelector('.brickContainer')
    this.templateMemoryBrick = document.querySelector('#template-memory-brick')
    this.templateA = this.templateMemoryBrick.content.firstElementChild
    this.init(this.windowElement)
  },

  /**
   * Function to initialize the basics
   * @param {DOMelement} windowElement The window element
   */
  init: function (windowElement) {
    let windowMenu = windowElement.querySelector('.window-menu')
    windowMenu.addEventListener('click', this.theMenuEventListener.bind(this))
    this.memoryContainer.addEventListener('click', this.theEventListener.bind(this))
  },

  /**
   * Function to start/activate the app
   */
  runMemory: function () {
    this.startTime = new Date()
    this.rows = parseInt(this.memoryContainer.getAttribute('board-size').charAt(0))
    this.cols = parseInt(this.memoryContainer.getAttribute('board-size').charAt(2))
    this.tiles = this.getPictureArray(this.rows, this.cols)

    this.clearBoard()
    this.resetCounters()

    for (let i in this.tiles) {
      let a = document.importNode(this.templateA, true)
      a.firstElementChild.setAttribute('data-brick-index', this.tiles[i])
      this.brickContainer.appendChild(a)

      if ((+i + 1) % this.cols === 0) {
        this.brickContainer.appendChild(document.createElement('br'))
      }
    }
    this.brickContainer.querySelector('.brick').focus()
  },

  /**
   * Event listener for the window menu
   */
  theMenuEventListener: function (event) {
    event.preventDefault()
    if (event.target.classList.contains('play')) {
      this.runMemory()
    } else if (event.target.classList.contains('board')) {
      this.buttonContainer.classList.toggle('hidden')
      this.centerElement(this.buttonContainer)
    }
  },

  /**
   * Event listener for the app
   */
  theEventListener: function (event) {
    event.preventDefault()
    if (event.target.classList.contains('boardSize')) {
      let boardSize = event.target.textContent
      this.memoryContainer.setAttribute('board-size', boardSize)
      this.buttonContainer.classList.toggle('hidden')
    } else {
      let img = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild
      if (img !== null) {
        let index = parseInt(img.getAttribute('data-brick-index'))
        if (!isNaN(index)) {
          this.turnBrick(index, img)
        }
      }
    }
  },

  /**
   * Function to turn the bricks
   * @param {int} index The index
   * @param {DOMelement} img An image
   */
  turnBrick: function (index, img) {
    let tile = index // this.tiles[index]

    if (this.curClickImg) {
      return
    }

    img.src = 'image/memory/' + tile + '.png'

    if (!this.prevClickImg) { // First click
      this.prevClickImg = img
      this.prevClickTile = tile
    } else { // Second Click
      if (this.prevClickImg === img) {
        return
      }
      this.noTries++
      this.curClickImg = img
      if (this.prevClickTile === tile) { // Found a pair
        this.foundPairs++
        if (this.foundPairs === (this.rows * this.cols) / 2) {
          let time = (new Date().getTime() - this.startTime) / 1000
          this.memoryContainer.querySelector('.tries').textContent = this.noTries
          this.memoryContainer.querySelector('.time').textContent = time
        }
        window.setTimeout(() => {
          this.prevClickImg.parentElement.classList.add('hidingBrick')
          this.curClickImg.parentElement.classList.add('hidingBrick')
          this.prevClickImg = null
          this.curClickImg = null
          if (this.checkBoardDone()) {
            this.victoryContainer.classList.toggle('hidden')
            this.centerElement(this.victoryContainer)
          }
        }, 500)
      } else {
        window.setTimeout(() => {
          this.prevClickImg.src = 'image/memory/0.png'
          this.curClickImg.src = 'image/memory/0.png'
          this.prevClickImg = null
          this.curClickImg = null
        }, 500)
      }
    }
  },

  /**
   * Function to center the element
   * @param {DOMelement} element The element
   */
  centerElement: function (element) {
    let rectWindow = this.windowElement.getBoundingClientRect()
    let rectElement = element.getBoundingClientRect()
    let left = (rectWindow.width - rectElement.width) / 2
    let top = (rectWindow.height - rectElement.height) / 2
    element.style.left = left + 'px'
    element.style.top = top + 'px'
  },

  /**
   * Function to check if game is done
   * @return {boolean}
   */
  checkBoardDone: function () {
    let bricks = this.brickContainer.querySelectorAll('.brick')
    let hidden = this.brickContainer.querySelectorAll('.hidingBrick')
    return hidden.length === bricks.length
  },

  /**
   * Function to clear the board
   */
  clearBoard: function () {
    let bricks = this.brickContainer.querySelectorAll('.brick')
    for (let i = 0; i < bricks.length; i++) {
      bricks[i].remove()
    }
    let br = this.brickContainer.querySelectorAll('br')
    for (let i = 0; i < br.length; i++) {
      br[i].remove()
    }
    if (!this.victoryContainer.classList.contains('hidden')) {
      this.victoryContainer.classList.add('hidden')
    }
    if (!this.buttonContainer.classList.contains('hidden')) {
      this.buttonContainer.classList.add('hidden')
    }
  },

  /**
   * Function to reset the counters
   */
  resetCounters: function () {
    this.curClickImg = null
    this.prevClickImg = null
    this.prevClickTile = 0
    this.foundPairs = 0
    this.noTries = 0
  },

  /**
   * Function to generate picture array
   * @param {int} rows The rows number
   * @param {int} cols The cols number
   * @return {array} The picture array
   */
  getPictureArray: function (rows, cols) {
    let arr = []
    let n = 0
    let x = 1
    let max = (rows * cols) / 2

    if (max === 2) {
      n = Math.floor(Math.random() * 7)
    } else if (max === 4) {
      n = Math.floor(Math.random() * 5)
    }

    for (let i = x + n; i <= max + n; i++) {
      for (let j = 0; j < 2; j++) {
        arr.push(i)
      }
    }

    arr.sort(function (a, b) {
      return 0.5 - Math.random()
    })

    return arr
  }
}

/**
 * Constructor for the Memory
 * @constructor
 */
let Memory = function () {
  return Object.create(memoryBase, {
    'templateMemoryBrick': {value: undefined, writable: true, enumerable: true, configurable: true},
    'templateA': {value: undefined, writable: true, enumerable: true, configurable: true},
    'windowElement': {value: undefined, writable: true, enumerable: true, configurable: true},
    'memoryContainer': {value: undefined, writable: true, enumerable: true, configurable: true},
    'victoryContainer': {value: undefined, writable: true, enumerable: true, configurable: true},
    'buttonContainer': {value: undefined, writable: true, enumerable: true, configurable: true},
    'brickContainer': {value: undefined, writable: true, enumerable: true, configurable: true},
    'tiles': {value: undefined, writable: true, enumerable: true, configurable: true},
    'curClickImg': {value: undefined, writable: true, enumerable: true, configurable: true},
    'prevClickImg': {value: undefined, writable: true, enumerable: true, configurable: true},
    'prevClickTile': {value: undefined, writable: true, enumerable: true, configurable: true},
    'foundPairs': {value: undefined, writable: true, enumerable: true, configurable: true},
    'noTries': {value: undefined, writable: true, enumerable: true, configurable: true},
    'rows': {value: undefined, writable: true, enumerable: true, configurable: true},
    'cols': {value: undefined, writable: true, enumerable: true, configurable: true},
    'ID': {value: undefined, writable: true, enumerable: true, configurable: true},
    'startTime': {value: undefined, writable: true, enumerable: true, configurable: true}
  })
}

module.exports = Memory
