<template>
  <el-dialog :before-close="close" title="员工导入" :visible.sync="showDialog" width="500px" @close="close">
    <el-row type="flex" justify="center" align="center">
      <div class="upload-excel">
        <input ref="upload" type="file" class="excel-upload-input" @change="uploadChange">
        <div class="drop">
          <i class="el-icon-upload" />
          <el-button type="text" @click="getExportTemplate">下载导入模板</el-button>
          <span>将文件拖到此处或
            <el-button type="text" @click="handleUpload">点击上传</el-button>
          </span>
        </div>
      </div>
    </el-row>

    <el-row type="flex" justify="end" align="center">
      <el-button size="mini" type="primary" @click="$emit('update:showDialog', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import FileSaver from 'file-saver'
import { getExportTemplateApi, importEmployeeApi } from '@/api/employee'
export default {
  name: 'ImportExcel',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('update:showDialog', false)
    },
    // 导出员工模版
    async getExportTemplate() {
      const res = await getExportTemplateApi()
      FileSaver.saveAs(res, '员工导入模版.xlsx')
    },
    // 1. 打开文件弹窗
    // 2. 获取选择的文件
    // 3. 判断是否选择了文件
    // 4. 实例化formData对象
    // 5. 将上传的文件添加到formData对象中
    // 6. 调用文件上传接口
    // 1. 打开文件选择弹窗
    handleUpload() {
      this.$refs.upload.click()
    },
    // 2. 获取选择上传的文件
    async uploadChange(event) {
      const file = event.srcElement.files
      console.log('file', file)
      if (file.length > 0) {
        // 3. 将文件转化为formdata 数据流
        const formData = new FormData()
        formData.append('file', file[0])

        // 4. 调用上传文件接口
        try {
          await importEmployeeApi(formData)
          // 成功
          this.$emit('uploadSuccess') // 通知父组件 我上传成功
          this.$emit('update:showDialog', false) // 关闭弹层
        } catch (error) {
          console.log(error)
        } finally {
          // 不论成功或者失败都会执行finally
          this.$refs.upload.value = ''
        }
      }
    }
  }
}
</script>

<style scoped>
.upload-excel {
  display: flex;
  justify-content: center;
  margin: 20px;
  width: 360px;
  height: 180px;
  align-items: center;
  color: #697086;

  .excel-upload-input {
    display: none;
  }

  .drop {
    border: 1px dashed #dcdfe6;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 160px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .drop {
    line-height: 40px;
    color: #bbb;

    i {
      font-size: 60px;
      display: block;
      color: #c0c4cc;
    }
  }
}
</style>
