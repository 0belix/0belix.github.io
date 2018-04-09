/* jshint asi: true, browser: true, expr: true, node: true, esversion: 6 */

'use strict'

const chatBase = {

  /**
   * Function to set the basics
   * @param {String} id The uniq id for the window element
   */
  set: function (id) {
    this.apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    this.ID = id
    this.windowElement = document.querySelector(`#${this.ID}`)
    this.chatContainer = this.windowElement.querySelector('.chatContainer')
    this.username = JSON.parse(window.localStorage.getItem('PWD-Chat-Username'))
    this.msgArray = []
    this.init(this.windowElement)
  },

  /**
   * Function to initialize the basics
   * @param {DOMelement} windowElement The window element
   */
  init: function (windowElement) {
    this.webSocket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/')
    this.webSocket.addEventListener('error', this.isOffline.bind(this))
    // this.webSocket.addEventListener('open', this.isOnline.bind(this))
    this.webSocket.addEventListener('message', this.onmessage.bind(this))

    let windowMenu = windowElement.querySelector('.window-menu')
    windowMenu.addEventListener('click', this.theMenuEventListener.bind(this))
    this.chatContainer.addEventListener('click', this.theEventListener.bind(this))
    this.chatContainer.addEventListener('keypress', this.theKeyEventListener.bind(this))

    this.chatContainer.addEventListener('unload', this.unload.bind(this))

    this.chatContainer.querySelector('textarea').focus()
    if (!this.username) {
      this.toggleUsernameSettings()
    }
  },

  /**
   * Function to unload the basics
   * @param {DOMelement} windowElement The window element
   */
  unload: function (windowElement) {
    this.webSocket.removeEventListener('message', this.onmessage.bind(this))
    // this.webSocket.removeEventListener('open', this.isOnline.bind(this))
    this.webSocket.removeEventListener('error', this.isOffline.bind(this))
    this.webSocket.close()

    this.chatContainer.removeEventListener('keypress', this.theKeyEventListener.bind(this))
    this.chatContainer.removeEventListener('click', this.theEventListener.bind(this))
    let windowMenu = windowElement.querySelector('.window-menu')
    windowMenu.removeEventListener('click', this.theMenuEventListener.bind(this))

    this.chatContainer.removeEventListener('unload', this.unload.bind(this))
  },

  /**
   * A function that can do something when error on web socket
   */
  isOffline: function (event) {
    console.log('ERROR!' + event.data)
  },

  /**
   * A function that can do something when web socket is online
   */
  isOnline: function (event) {
    console.log('Online')
  },

  /**
   * A function that does something when receiveing messages via web socket
   */
  onmessage: function (event) {
    let data = JSON.parse(event.data)
    if (data.username === 'The Server' && data.type === 'notification' && data.data === 'You are connected!') {
      // console.log('I am connected!')
    } else if (data.username !== 'The Server' && data.type !== 'heartbeat' && data.data !== '') {
      this.addBubble(data)
    }
  },

  /**
   * Event listener for the window menu
   */
  theMenuEventListener: function (event) {
    event.preventDefault()
    if (event.target.classList.contains('username')) {
      this.toggleUsernameSettings()
      if (this.username) {
        this.chatContainer.querySelector('.nickname').value = this.username
      }
    }
  },

  /**
   * Event listener for the app
   */
  theEventListener: function (event) {
    event.preventDefault()
    if (event.target.classList.contains('submit')) {
      if (!this.username) {
        this.toggleUsernameSettings()
      } else {
        if (this.chatContainer.querySelector('textarea').value.trim() !== '') {
          this.submitting()
        }
      }
    } else if (event.target.classList.contains('save')) {
      if (this.chatContainer.querySelector('.nickname').value.trim() !== '') {
        this.saveUsername()
        this.toggleUsernameSettings()
      }
    }
  },

  /**
   * Keyboard event listener for the app
   */
  theKeyEventListener: function (event) {
    let key = event.buttons || event.which || event.keyCode
    if (event.target.classList.contains('submit')) {
      if (key === 13) {
        if (!this.username) {
        } else {
          event.preventDefault()
          if (this.chatContainer.querySelector('textarea').value.trim() !== '') {
            this.submitting()
          }
        }
      }
    } else if (event.target.classList.contains('save')) {
      if (key === 13) {
        event.preventDefault()
        if (this.chatContainer.querySelector('.nickname').value.trim() !== '') {
          this.saveUsername()
          this.toggleUsernameSettings()
        }
      }
    }
  },

  /**
   * Parses the history messages to bubbles
   */
  printHistory: function () {
    let data = JSON.parse(window.localStorage.getItem('PWD-Chat-chatHistory'))
    for (let i in data) {
      this.addBubble(data[i])
    }
  },

  /**
   * init a bubble with a message
   * @param {Object} data The message
   */
  addBubble: function (data) {
    let hand = data.username === this.username ? 'left' : 'right'
    let templateChatBubble = document.querySelector('#template-chat-bubble').content.cloneNode(true)
    let chatBubble = templateChatBubble.querySelector('.chat-bubble')
    chatBubble.classList.add(hand)
    let timeOption = {
      hour12: false,
      weekday: 'narrow',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
    if (!data.timeMessageWasReceived) {
      data.timeMessageWasReceived = new Date().toLocaleTimeString('sv-se', timeOption)
    }
    chatBubble.querySelector('.name').textContent = data.username
    chatBubble.querySelector('.msg').textContent = data.data
    chatBubble.querySelector('.time').textContent = data.timeMessageWasReceived
    let chatArea = this.chatContainer.querySelector('.chatArea')
    if (chatArea) {
      chatArea.appendChild(chatBubble)
      chatArea.scrollTop = chatArea.scrollHeight
    }
    this.saveMessages(data)
  },

  /**
   * Saves the username to local storage
   */
  saveUsername: function () {
    this.username = this.chatContainer.querySelector('.nickname').value
    window.localStorage.setItem('PWD-Chat-Username', JSON.stringify(this.username))
  },

  /**
   * Showing/hiding the usename dialog
   */
  toggleUsernameSettings: function () {
    this.chatContainer.querySelector('.chatArea').classList.toggle('invisible')
    this.chatContainer.querySelector('.userDiv').classList.toggle('hidden')
    this.chatContainer.querySelector('textarea').focus()
    this.chatContainer.querySelector('.userDiv input').focus()
  },

  /**
   * A function that sends messages via web socket
   */
  submitting: function () {
    let textArea = this.chatContainer.querySelector('textarea')
    let msg = {
      type: 'message',
      data: textArea.value,
      username: this.username,
      key: this.apiKey
    }
    this.webSocket.send(JSON.stringify(msg))
    textArea.value = ''
    textArea.focus()
  },

  /**
   * Saves the message to local storage
   * @param {Object} data The message
   */
  saveMessages: function (data) {
    if (this.msgArray.length === 20) {
      this.msgArray.shift()
      this.msgArray.push(data)
    } else {
      this.msgArray.push(data)
    }
    window.localStorage.setItem('PWD-Chat-chatHistory', JSON.stringify(this.msgArray))
  }
}

/**
 * Constructor for the Chat
 * @constructor
 */
let Chat = function () {
  return Object.create(chatBase, {
    'apiKey': {value: undefined, writable: true, enumerable: true, configurable: true},
    'webSocket': {value: undefined, writable: true, enumerable: true, configurable: true},
    'ID': {value: undefined, writable: true, enumerable: true, configurable: true},
    'windowElement': {value: undefined, writable: true, enumerable: true, configurable: true},
    'chatContainer': {value: undefined, writable: true, enumerable: true, configurable: true},
    'username': {value: undefined, writable: true, enumerable: true, configurable: true},
    'msgArray': {value: undefined, writable: true, enumerable: true, configurable: true}
  })
}

module.exports = Chat
