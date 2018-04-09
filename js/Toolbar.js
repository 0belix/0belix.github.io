/* jshint asi: true, browser: true, expr: true, node: true, esversion: 6 */

'use strict'

const Desktop = require('./Desktop')
const TemplateWindow = require('./TemplateWindow')
const Chat = require('./Chat')
const Memory = require('./Memory')
const Calculator = require('./Calculator')

const toolbarBase = {

  /**
   * Function to initialize the basics
   */
  init: function () {
    document.querySelector('#toolbar').addEventListener('click', this.launchProgram.bind(this))
    this.desktop = Desktop()
    this.desktop.initEventListeners()
    this.whatIsTheTime()
    window.setInterval(this.whatIsTheTime.bind(this), 1000)
  },

  /**
   * Function to initialize/launch apps
   */
  launchProgram: function (event) {
    if (event.target.parentElement.classList.contains('restart')) {
      let elements = document.querySelector('#desktop').querySelectorAll('*')
      for (let i = 0; i < elements.length; i++) {
        elements[i].remove()
      }
      this.desktop.resetXYZ()
    } else if (event.target.parentElement.classList.contains('chat')) {
      this.launchChat()
    } else if (event.target.parentElement.classList.contains('memory')) {
      this.launchMemory()
    } else if (event.target.parentElement.classList.contains('calculator')) {
      this.launchCalculator()
    }
  },

  /**
   * Function to "build" the new window element
   * @param {Object} preference For the new window element
   * @return {Object} The window  object
   */
  pieceTogetherWindow: function (preference) {
    let windowObject = TemplateWindow()
    windowObject.set(preference)
    this.desktop.activateFocus(windowObject.windowElement)
    return windowObject
  },

  /**
   * Function to "build" the new window menu
   * @param {Object} windowObject The new window
   * @param {array} menuConent The new window
   */
  deviseMenu: function (windowObject, menuConent) {
    let windowMenu = windowObject.windowElement.querySelector('.window-menu')
    windowMenu.classList.add('menu' + windowObject.title)
    let menu = menuConent
    for (let i = 0; i < menu.length; i++) {
      windowMenu.appendChild(document.createElement('span'))
      windowMenu.querySelectorAll('span')[i].textContent = menu[i]
      windowMenu.querySelectorAll('span')[i].classList.add(menu[i].toLowerCase())
    }
  },

  /**
   * Function to initialize/launch the Chat app
   */
  launchChat: function () {
    let preference = {
      height: 500,
      width: 300,
      icon: '../image/wechat-black.png',
      title: 'Chat'
    }
    let windowObject = this.pieceTogetherWindow(preference)

    this.deviseMenu(windowObject, ['Username'])

    let templateChat = document.querySelector('#template-chat').content.cloneNode(true)
    let chatContainer = templateChat.querySelector('.chatContainer')
    windowObject.windowElement.querySelector('.window-content').appendChild(chatContainer)

    this.desktop.populateDesktop(windowObject)

    let chat = Chat()
    chat.set(windowObject.id)
    chat.printHistory()
  },

  /**
   * Function to initialize/launch the Memory app
   */
  launchMemory: function () {
    let preference = {
      height: 296,
      width: 248,
      icon: '../image/border-all-black.png',
      title: 'Memory'
    }
    let windowObject = this.pieceTogetherWindow(preference)

    this.deviseMenu(windowObject, ['Play', 'Board'])

    let templateMemory = document.querySelector('#template-memory').content.cloneNode(true)
    let memoryContainer = templateMemory.querySelector('.memoryContainer')
    memoryContainer.setAttribute('board-size', '2x2')
    windowObject.windowElement.querySelector('.window-content').appendChild(memoryContainer)

    this.desktop.populateDesktop(windowObject)

    let memory = Memory()
    memory.set(windowObject.id)
    memory.runMemory()
  },

  /**
   * Function to initialize/launch the Calculator app
   */
  launchCalculator: function () {
    let preference = {
      height: 346,
      width: 252,
      icon: '../image/calculator-black.png',
      title: 'Calculator'
    }
    let windowObject = this.pieceTogetherWindow(preference)

    this.deviseMenu(windowObject, ['History'])

    let templateCalculator = document.querySelector('#template-calculator').content.cloneNode(true)
    let calculatorContainer = templateCalculator.querySelector('.calculatorContainer')
    windowObject.windowElement.querySelector('.window-content').appendChild(calculatorContainer)

    this.desktop.populateDesktop(windowObject)

    let calculator = Calculator()
    calculator.set(windowObject.id)
  },

  /**
   * Function to update the clock
   */
  whatIsTheTime: function () {
    let dateOption = {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }
    let timeOption = {
      hour12: false,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }
    document.querySelector('#toolbar .toolbar-clock .toolbar-clock-date').textContent = new Date().toLocaleDateString('sv-se', dateOption)
    document.querySelector('#toolbar .toolbar-clock .toolbar-clock-time').textContent = new Date().toLocaleTimeString('sv-se', timeOption)
  }
}

/**
 * Constructor for the Toolbar
 * @constructor
 */
let Toolbar = function () {
  return Object.create(toolbarBase, {
    'desktop': {value: undefined, writable: true, enumerable: true, configurable: true}
  })
}

module.exports = Toolbar
