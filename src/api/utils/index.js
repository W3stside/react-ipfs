export const promisify = (func, context, ...defArgs) =>
  (...args) => new Promise((res, rej) => {
    func.apply(context, [...defArgs, ...args, (err, result) => err ? rej(err) : res(result)])
  })

export const windowLoadWait = new Promise((accept, reject) => {
  if (window === 'undefined') return accept()
  if(window.addEventListener === 'undefined') {
    return reject(new Error('Should be able to listen for Events'))
  }

  window.addEventListener('load', function loadHandler() {
    window.removeEventListener('load', loadHandler)

    return accept('Window loaded')
  }, null)
})

export const readFileUpload = file =>
    new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = e => resolve(e.target.result)
      r.readAsArrayBuffer(file)
    })

export default windowLoadWait
