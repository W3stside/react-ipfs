import React from 'react'

import { promisedIPFS } from '../api/IPFS'
import { readFileUpload } from '../api/utils'

const statePrint = {
  position: 'fixed', left: 0, top: 0,
  zIndex: 999,
}

// HOC that injects IPFS node instructions
export default (WrappedComponent) => {
  return class WrappingClass extends React.Component {
    state = {}

    async componentDidMount() {
      // not really necessary
      const { ipfs: node } = await promisedIPFS
      this.setState({ node })
    }

    handleFileUpload = async ({ target: { files } }) => {
      const [oFile] = files
      console.warn('Detected change: ', oFile)
      if(!oFile) throw new Error('No file uploaded')

      // HTML5 API to read file and set state as contents
      const fileBuffer = await readFileUpload(oFile)
      this.setState({ oFile, fileBuffer })
    }

    handleSendToIPFS = async () => {
      const { ipfsAddFile } = await promisedIPFS, { fileBuffer, oFile } = this.state
      try {
        const { fileHash, filePath } = await ipfsAddFile(fileBuffer, oFile)

        this.setState({
          fileHash,
          filePath,
        })
      } catch (error) {
        console.error(error)
        this.setState({
          error,
        })
      }
    }

    handleGrabFromIPFS = async () => {
      const { ipfsGetAndDecode } = await promisedIPFS, { fileHash } = this.state
      try {
        const fileContent = await ipfsGetAndDecode(fileHash)

        this.setState({ fileContent })
      } catch (error) {
        console.error(error)
        this.setState({
          error,
        })
      }
    }

    render() {
      return (
        <div>
          {this.state.fileBuffer &&
            <code style={statePrint}>
              {JSON.stringify(
                {
                  buffer: this.state.fileBuffer,
                  fileHash: this.state.fileHash,
                  filePath: this.state.filePath,
                  fileContent: this.state.fileContent,
                }, null, 2)}
            </code>}
          <WrappedComponent
            handleFileUpload = {this.handleFileUpload}
            handleSendToIPFS = {this.handleSendToIPFS}
            handleGrabFromIPFS = {this.handleGrabFromIPFS}
            {...this.props}
            {...this.state}
          />
        </div>
      )
    }
  }
}