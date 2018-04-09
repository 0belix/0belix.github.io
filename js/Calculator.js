/* jshint asi: true, browser: true, expr: true, node: true, esversion: 6 */

'use strict'

const calculatorBase = {

  /**
   * Function to set the basics
   * @param {String} id The uniq id for the window element
   */
  set: function (id) {
    this.ID = id
    this.windowElement = document.querySelector(`#${this.ID}`)
    this.calculatorContainer = this.windowElement.querySelector('.calculatorContainer')
    this.display = this.calculatorContainer.querySelector('.display')
    this.historyContainer = this.calculatorContainer.querySelector('.calculator-history')
    this.init(this.windowElement)
  },

  /**
   * Function to initialize the basics
   * @param {DOMelement} windowElement The window element
   */
  init: function (windowElement) {
    let windowMenu = windowElement.querySelector('.window-menu')
    windowMenu.addEventListener('click', this.theMenuEventListener.bind(this))
    this.calculatorContainer.addEventListener('click', this.theEventListener.bind(this))
    this.calculatorContainer.addEventListener('keydown', this.theKeyEventListener.bind(this))
  },

  /**
   * Event listener for the window menu
   */
  theMenuEventListener: function (event) {
    event.preventDefault()
    if (event.target.classList.contains('history')) {
      this.toggleHistory()
    }
  },

  /**
   * Event listener for the app
   */
  theEventListener: function (event) {
    event.preventDefault()
    let key = event.target.textContent.charCodeAt(0)
    if (event.target.textContent === 'CE') {
      this.inputDisplay(46)
    } else if (event.target.textContent === 'C') {
      this.inputDisplay(8)
    } else if (key === 247) { // ×
      this.inputDisplay(111)
    } else if (key === 8203) { // ÷
      this.inputDisplay(106)
    } else if (key === 46) { // .
      this.inputDisplay(110)
    } else if (key === 61) { // =
      this.inputDisplay(13)
    } else {
      this.inputDisplay(key)
    }
  },

  /**
   * Keyboard event listener for the app
   */
  theKeyEventListener: function (event) {
    let key = event.buttons || event.which || event.keyCode
    if (key !== 9 && key !== 32) {
      event.preventDefault()
    }
    this.inputDisplay(key)
  },

  /**
   * Function to handle the input to the display
   * @param {int} key The key action
   */
  inputDisplay: function (key) {
    let inputDisplay = this.display.querySelector('input')
    if (key === 110 || key === 188 || key === 190) {
      inputDisplay.value += '.'
    } else if (key === 43 || key === 107 || key === 187) {
      inputDisplay.value += String.fromCharCode(43) // +
    } else if (key === 45 || key === 109 || key === 189) {
      inputDisplay.value += String.fromCharCode(45) // -
    } else if (key === 42 || key === 106 || key === 191) {
      inputDisplay.value += String.fromCharCode(42) // *
    } else if (key === 47 || key === 111 || key === 219) {
      inputDisplay.value += String.fromCharCode(47) // /
    } else if (key >= 48 && key <= 57) {
      inputDisplay.value += String.fromCharCode(key)
    } else if (key >= 96 && key <= 105) {
      inputDisplay.value += String.fromCharCode(key - 48)
    } else if (key === 8 || key === 67) {
      inputDisplay.value = inputDisplay.value.slice(0, -1)
    } else if (key === 46) {
      inputDisplay.value = null
    } else if (key === 13) {
      inputDisplay.value = this.calc(inputDisplay.value)
    }
  },

  /**
   * The function to do the calculation
   * @param {String} input The math to calculate
   * @return {int} The sum
   */
  calc: function (input) {
    try {
      let sum = eval(input) // TODO: Replace eval()
      this.history(input, sum)
      return sum
    } catch (e) {
      return 'Error'
    }
  },

  /**
   * Hide or show the history part of window
   */
  toggleHistory: function () {
    this.historyContainer.classList.toggle('hidden')
    if (!this.historyContainer.classList.contains('hidden')) {
      this.windowElement.style.width = 504 + 'px'
    } else {
      this.windowElement.style.width = null
    }
  },

  /**
   * Populate the history window
   * @param {String} input The math part
   * @param {int} sum The calculated part
   */
  history: function (input, sum) {
    let templateHistoryElement = document.querySelector('#template-calculator-history').content.cloneNode(true)
    let historyDiv = templateHistoryElement.querySelector('.calcHistory')
    historyDiv.querySelector('.calc').textContent = input
    historyDiv.querySelector('.sum').textContent = sum
    this.historyContainer.insertBefore(historyDiv, this.historyContainer.firstElementChild)
  }
}

/**
 * Constructor for the Calculator
 * @constructor
 */
let Calculator = function () {
  return Object.create(calculatorBase, {
    'ID': {value: undefined, writable: true, enumerable: true, configurable: true},
    'windowElement': {value: undefined, writable: true, enumerable: true, configurable: true},
    'calculatorContainer': {value: undefined, writable: true, enumerable: true, configurable: true},
    'display': {value: undefined, writable: true, enumerable: true, configurable: true},
    'historyContainer': {value: undefined, writable: true, enumerable: true, configurable: true}
  })
}

module.exports = Calculator
