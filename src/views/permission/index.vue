<template>
  <div class="container">
    <div class="app-container">
      <el-button type="primary" size="mini" @click="add(0, 1)">添加权限</el-button>
      <el-table class="el-table" :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id" border
        default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column prop="code" label="标识">
        </el-table-column>
        <el-table-column prop="description" label="描述">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="text" v-if="row.type == 1" @click="add(row.pid, 2)">添加</el-button>
            <el-button type="text" @click="edit(row.id)">编辑</el-button>
            <el-button type="text" @click="erase(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="ruleForm.code"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item label="开启" prop="enVisible">
          <el-switch v-model="ruleForm.enVisible"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center;">
        <el-button type="primary" size="mini" @click="submitForm">确 定</el-button>
        <el-button size="mini" @click="resetForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { permisApi, addApi, deleteApi, detailApi, reviseApi } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Permission',

  data() {
    return {
      //列表数据
      tableData: [],
      //添加弹窗状态
      dialogVisible: false,
      //表单数据
      ruleForm: {
        name: '',
        code: '',
        description: '',
        enVisible: false
      },
      //表单验证
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' }
        ]
      },
      //表单标题
      title: "",
      //是否是编辑状态
      did: undefined
    };
  },
  created() {
    this.getList()
  },
  methods: {
    //获取列表数据
    async getList() {
      try {
        const res = await permisApi()
        // console.log(res);
        this.tableData = transListToTreeData(res, 0)
      } catch (error) {
        console.log(error);
      }
    },
    //添加弹窗事件
    add(pid, type) {
      this.title = "新增权限点"
      this.dialogVisible = true
      this.ruleForm.pid = pid
      this.ruleForm.type = type
    },
    //编辑弹窗事件
    async edit(id) {
      this.title = "编辑权限点"
      const res = await detailApi(id)
      this.ruleForm = res
      console.log(this.ruleForm);
      this.did = id
      this.dialogVisible = true
    },
    //确定事件
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.did) {
            const res = await reviseApi(this.did, this.ruleForm)
            // console.log(res);
            this.$message.success('更新权限点成功')
          } else {
            const res = await addApi(this.ruleForm)
            // console.log(res);
            this.$message.success('添加权限点成功')
          }
          this.resetForm()
          this.getList()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //取消事件
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.dialogVisible = false
    },
    //关闭弹窗事件
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          this.$refs.ruleForm.resetFields();
        })
        .catch(_ => { });
    },
    //删除事件
    erase(id) {
      this.$confirm('确定要删除该数据吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async () => {
        const res = await deleteApi(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 15px;
}

.el-table {
  margin-top: 20px;
}
</style>
