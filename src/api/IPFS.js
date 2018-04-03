import IPFS from 'ipfs'
import { windowLoadWait } from './utils'

/**
 * @returns Promise<IPFS>
 */
const setupIPFS = async () => {
  await windowLoadWait

  const node = new IPFS()
  return node
}

export const promisedIPFS = init()

async function init() {
  const ipfs = await setupIPFS()

  /**
   * ipfsAddFile - takes uint8Array Buffer and sends to IPFS node
   * @param {uint8[]} fileBuffer - uint8Array encoded JSON
   */
  const ipfsAddFile = async (fileBuffer, oFile) => {
    console.log(fileBuffer)
    const [file0] = await ipfs.files.add({
      path: oFile.name,
      content: Buffer.from(fileBuffer)
    })

    const { hash: fileHash, path: filePath } = file0

    console.warn('IPFS file added: ', { fileHash, filePath })

    return {
      fileHash,
      filePath,
    }
  }

  /**
   * ipfsGetAndDecode - grabs IPFS file via hash and decodes from uint8Array to string
   * @param {string} fileHash - hash value stored in IPFS
   */
  const ipfsGetAndDecode = async (fileHash) => {
    const [file0] = await ipfs.files.get(fileHash)
    const { content: contentArrayBuffer } = file0

    console.warn('IPFS file grabbed receipt: ', contentArrayBuffer)

    const fileContent = new TextDecoder('utf-8').decode(contentArrayBuffer)

    return fileContent
  }

  return {
    ipfs,
    ipfsGetAndDecode,
    ipfsAddFile,
  }
}


