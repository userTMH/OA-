<template>
  <el-cascader :value="value" size="mini" class="inputW" :props="props" :options="options" @change="handleChange" />
</template>
<script>
import { departmentApi } from '@/api/department'
import { transListToTreeData } from '@/utils'
export default {
  name: 'SeletTree',
  props: {
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      options: [],
      props: {
        label: 'name',
        value: 'id',
        children: 'children'
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const res = await departmentApi()

      this.options = transListToTreeData(res, 0)
      console.log('res=>>>', this.options)
    },
    handleChange(event) {
      console.log('event===>', event)
      if (event.length > 0) {
        this.$emit('input', event[event.length - 1])
      } else {
        this.$emit('input', null)
      }
    }
  }
}
</script>
<style scoped></style>
