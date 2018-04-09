/* jshint asi: true, browser: true, expr: true, node: true, esversion: 6 */

'use strict'

const templateWindowBase = {

  /**
   * Function to set the basics
   * @param {Object} preference The preferences for the new window element
   */
  set: function (preference) {
    this.height = preference.height || 300
    this.width = preference.width || 200
    this.icon = preference.icon || '../image/emoticon-poop-black.png'
    this.title = preference.title || 'Window title'
    this.id = 'ID-' + this.uuidv4()
    this.windowElement = this.assembleWindow()
  },

  /**
   * Function to generate the windowElement
   * @return {DOMelement} The windowElement
   */
  assembleWindow: function () {
    let templateWindow = document.querySelector('#template-window').content.cloneNode(true)
    let newWindow = templateWindow.querySelector('.window-frame')
    newWindow.id = this.id
    newWindow.style.width = this.width + 'px'
    newWindow.style.height = this.height + 'px'
    newWindow.querySelector('.window-title img').src = this.icon
    newWindow.querySelector('.window-title span').textContent = this.title
    return newWindow
  },

  /**
   * Function to generate a uniq id
   * @return {string} The id
   */
  uuidv4: function () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }
}

/**
 * Constructor for a Template Window
 * @constructor
 */
let TemplateWindow = function () {
  return Object.create(templateWindowBase, {
    'height': {value: undefined, writable: true, enumerable: true, configurable: true},
    'width': {value: undefined, writable: true, enumerable: true, configurable: true},
    'icon': {value: undefined, writable: true, enumerable: true, configurable: true},
    'title': {value: undefined, writable: true, enumerable: true, configurable: true},
    'id': {value: undefined, writable: true, enumerable: true, configurable: true},
    'windowElement': {value: undefined, writable: true, enumerable: true, configurable: true}
  })
}

module.exports = TemplateWindow
