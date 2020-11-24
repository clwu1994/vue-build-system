import { deepClone } from '@/utils/index'

const componentChild = {}
/**
 * 将./slots中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__config__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
const slotsFiles = require.context('./slots', false, /\.js$/)
export default {
  props: {
    conf: {
      type: Object,
      required: true
    }
  },
  render(h) {
    const dataObject = {}
    const children = this.$slots.default || []
    return h(this.conf.__config__.tag, dataObject, children)
  }
}
