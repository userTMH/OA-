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
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
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
import { departmentApi, addDepartment, detailDepartment, editDepartment, deleteDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Department',
  data() {
    return {
      //列表数据
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      //弹窗状态
      dialogVisible: false,
      //详情ID
      userPid: '',
      //负责人列表
      managerIdLiat: [],
      //表单数据
      ruleForm: {
        name: '',
        code: '',
        managerId: '',
        introduce: '',
      },
      //表单验证
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
      },
      //表单标题
      title: '',
      //操作状态
      eList: '',
      //pid
      pid: 0
    };
  },
  created() {
    this.getDepartmentApi()
  },
  methods: {
    //获取列表数据
    async getDepartmentApi() {
      const res = await departmentApi()
      // console.log(res);
      this.managerIdLiat = res
      const list = transListToTreeData(res, 0)
      this.data = list
    },
    //操作事件
    async command(e, id) {
      console.log(e);
      this.eList = e
      this.userPid = id
      // console.log(this.userPid);
      if (e == 'add') {     //新增
        this.dialogVisible = true
        this.title = '新增部门'
      } else if (e == 'edit') {       //编辑
        this.dialogVisible = true
        this.title = '编辑部门'
        const res = await detailDepartment(this.userPid)
        this.ruleForm = res
        this.pid = res.pid
        // console.log(this.ruleForm);
      } else if (this.eList == 'delete') {      //删除
        this.open()
      }
    },
    //确定按钮
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.ruleForm.pid = this.userPid
          if (this.eList == 'add') {
            const res = await addDepartment(this.ruleForm)
            // console.log(res);
            this.$message.success('新增成功')
            this.resetFrom()
            this.getDepartmentApi()
          } else if (this.eList == 'edit') {
            this.ruleForm.pid = this.pid
            const res = await editDepartment(this.userPid, this.ruleForm)
            this.$message.success('更新部门详情成功')
            this.resetFrom()
            this.getDepartmentApi()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //取消
    resetFrom() {
      this.$refs.ruleForm.resetFields();
      this.dialogVisible = false
    },
    //关闭
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          this.resetFrom()
        })
        .catch(_ => { });
    },
    //删除
    open() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const res = deleteDepartment(this.userPid)
        console.log(res);
        this.getDepartmentApi()
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
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
  margin: 10px;
  padding: 20px 140px;
}
</style>
