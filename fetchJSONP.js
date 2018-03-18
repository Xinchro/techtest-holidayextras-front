function fetchJSONP(url, callbackName) {
  return new Promise((res, rej) => {
    let script = document.createElement('script')

    if (url.match(/\?/)) url += "&callback="+callbackName
    else url += "?callback="+callbackName

    script.src = url
    window[callbackName] = (json) => {
      res(new Response(JSON.stringify(json)))
      script.remove()
      delete window[callbackName]
    }

    document.body.appendChild(script)
  })
}
