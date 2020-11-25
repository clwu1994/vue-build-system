const callbacks = {}

/**
 * 加载一个远程脚本
 * @param {*} src 一个远程脚本
 * @param {*} callback 回调
 */
function loadScript(src, callback) {
  const existingScript = document.getElementById(src)
  const cb = callback || (() => {})
  if (!existingScript) {
    callbacks[src] = []
    const $script = document.createElement('script')
    $script.src = src
    $script.id = src
    $script.async = 1
    document.body.appendChild($script)
    const onEnd = 'onload' in $script ? stdOnEnd.bind($script) : ieOnEnd.bind($script)
    onEnd($script)
  }
  callbacks[src].push(cb)

  function stdOnEnd(script) {
    script.onload = () => {
      this.onerror = this.onload = null
      callbacks[src].forEach(item => {
        item(null, script)
      })
      delete callbacks[src]
    }
    script.onerror = () => {
      this.onerror = this.onload = null
      cb(new Error(`Failed to load ${src}`), script)
    }
  }

  function ieOnEnd(script) {
    script.onreadystatechange = () => {
      if (this.readyState !== 'complete' && this.readyState !== 'loaded') return
      this.onreadystatechange = null
      callbacks[src].forEach(item => {
        item(null, script)
      })
      delete callbacks[src]
    }
  }
}

/**
 * 顺序加载一组远程脚本
 * @param {*} list 一组远程脚本
 * @param {*} cb 回调
 */
function loadScriptQueue(list, cb) {
  const first = list.shift()
  list.length ? loadScript(first, () => loadScriptQueue(list, cb)) : loadScript(first, cb)
}