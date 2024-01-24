<template>
  <div class="container">
    <div class="app-container">
      <el-tree :data="data" :props="defaultProps" :expand-on-click-node="false" :default-expand-all="true">
        <template v-slot="{ node, data }">
          <el-row type="flex" justify="space-between" align="middle" style="width: 100%;height: 30px;">
            <el-col>{{ data.name }}</el-col>
            <span style="margin-right: 10px;">{{ data.managerName }}</span>
            <el-dropdown @command="command($event, data.id)">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-row>
        </template>
      </el-tree>
    </div>
    <el-dialog title="部门名称" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="2-10个字符"></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="ruleForm.code" placeholder="2-10个字符"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="managerId">
          <el-select v-model="ruleForm.managerId" placeholder="请选择负责人">
            <el-option v-for="(item, index) in managerIdLiat" :key="index" :label="item.managerName"
              :value="item.id"></el-option>
            <el-option label="李四" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input type="textarea" v-model="ruleForm.introduce" placeholder="1-100个字符"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="resetFrom">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { departmentApi, addDepartment } from '@/api/department'
export default {
  name: 'Department',
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogVisible: false,
      userPid: '',
      managerIdLiat: [],
      ruleForm: {
        name: '',
        code: '',
        managerId: '',
        introduce: '',
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        managerId: [
          { required: true, message: '部门负责人不能为空', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getDepartmentApi()
  },
  methods: {
    async getDepartmentApi() {
      const res = await departmentApi()
      // console.log(res);
      this.managerIdLiat = res
      const list = this.getList(res, 0)
      this.data = list
    },
    getList(data, valueId) {
      const arr = []
      data.forEach((item) => {
        if (item.pid == valueId) {
          const children = this.getList(data, item.id)
          item.children = children
          arr.push(item)
        }
      })
      return arr
    },
    command(e, id) {
      this.dialogVisible = true
      console.log(e);
      this.userPid = id
    },
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.ruleForm.pid = this.userPid
          const res = await addDepartment(this.ruleForm)
          // console.log(res);
          this.$message.success('新增成功')
          this.resetFrom()
          this.getDepartmentApi()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetFrom() {
      this.$refs.ruleForm.resetFields();
      this.dialogVisible = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          this.resetFrom()
        })
        .catch(_ => { });
    }
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  margin: 10px;
  padding: 20px 140px;
}
</style>
