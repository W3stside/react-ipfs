import React, { Component } from 'react'

import IPFSInject from './HOC'

import logo from './logo.svg'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="ipfsContainer">
          <input
            id="file"
            name="file"
            type="file"

            onChange={this.props.handleFileUpload}
          />

          <button
            disabled={!this.props.fileBuffer}
            onClick={this.props.handleSendToIPFS}
          >
            Send to IPFS Repo
          </button>

          <button
            disabled={!this.props.fileHash}
            onClick={this.props.handleGrabFromIPFS}
          >
            Grab from IPFS Repo
          </button>
          IPFS Content below:
          <code>{this.props.fileContent || 'IPFS Content Will Show Here'}</code>
        </div>
      </div>
    )
  }
}

export default IPFSInject(App)
