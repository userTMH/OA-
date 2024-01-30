<template>
  <div class="container">
    <div class="app-container" style="padding: 20px;">
      <el-button type="primary" class="add" @click="dialogVisible = true">添加角色</el-button>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column label="角色">
          <template v-slot="{ row }">
            <el-input v-if="row.editstate" v-model="row.dataList.name" size="mini"></el-input>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="启动">
          <template v-slot="{ row }">
            <el-switch v-if="row.editstate" v-model="row.dataList.state" :active-value="1" :inactive-value="0"
              active-color="#409eff" inactive-color="#ff4949">
            </el-switch>
            <span v-else>{{ row.state == 1 ? '已启动' : row.state == 0 ? '未启动' : '空' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述">
          <template v-slot="{ row }">
            <el-input v-if="row.editstate" type="textarea" :rows="2" placeholder="请输入内容"
              v-model="row.dataList.description" size="mini">
            </el-input>
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <template v-if="row.editstate">
              <el-button type="primary" size="small" @click="add(row)">
                确定
              </el-button>
              <el-button size="small" @click="row.editstate = false">
                取消
              </el-button>
            </template>
            <template v-else>
              <el-button type="text" size="small" @click="Prem(row.id)">
                分配权限
              </el-button>
              <el-button type="text" size="small" @click="edit(row)">
                编辑
              </el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" style="margin-left: 10px;" @onConfirm="dateat(row)">
                <el-button type="text" slot="reference" size="small">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;">
        <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="pagesize"
          layout=" prev, pager,next" :total="total" />
      </div>
    </div>
    <!-- 添加弹窗 -->
    <el-dialog title="新增角色" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="启用" prop="state">
          <el-switch v-model="ruleForm.state"></el-switch>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 权限弹窗 -->
    <el-dialog title="分配权限" :visible.sync="dialog" width="40%" :before-close="handleClose">
      <el-tree ref="permissionTree" :data="permissionList" show-checkbox node-key="id" default-expand-all
        :default-checked-keys="permissionIds" :props="defaultProps" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="yes">确 定</el-button>
        <el-button @click="dialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listApi, addApi, editApi, deltetApi, getRoleDetailApi, assignPremApi } from '@/api/role'
import { permisApi } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Role',

  data() {
    return {
      //列表数据
      tableData: [],
      //页码
      page: 1,
      //条数
      pagesize: 5,
      //总数
      total: 0,
      //弹窗状态
      dialogVisible: false,
      //权限弹窗状态
      dialog: false,
      //表单数据
      ruleForm: {
        name: '',
        state: true,
        description: ''
      },
      //表单验证
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' },
        ]
      },
      //权限数据
      permissionList: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      //回显
      permissionIds: [],
      //角色ID
      Id: 0
    };
  },
  created() {
    this.getList()
  },
  methods: {
    //获取数据
    async getList() {
      const res = await listApi({
        page: this.page,
        pagesize: this.pagesize
      })
      // console.log(res.rows);
      res.rows.forEach(item => {
        this.$set(item, 'editstate', false)
        this.$set(item, 'dataList', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      });
      this.tableData = res.rows
      // console.log(this.tableData);
      this.total = res.total
    },
    //分页事件
    handleCurrentChange(e) {
      this.page = e
      this.getList()
    },
    //弹窗关闭事件
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          this.resetForm()
        })
        .catch(_ => { });
    },
    //新增确认事件
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const res = await addApi(this.ruleForm)
          // console.log(res);
          this.$message({
            type: 'success',
            message: '新增角色成功',
            duration: 2000,
          })
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
    //编辑
    edit(row) {
      row.editstate = true
      row.dataList.name = row.name
      row.dataList.state = row.state
      row.dataList.description = row.description
    },
    //编辑确定事件
    async add(row) {
      // console.log(row);
      const res = await editApi(row.id, { ...row.dataList, id: row.id })
      // console.log(res);
      this.$message.success("更新角色详情成功")
      this.dialogVisible = false
      this.getList()
    },
    //删除
    async dateat(row) {
      const res = await deltetApi(row.id)
      // console.log(res);
      this.$message.success("删除角色成功")
      this.getList()
    },
    //权限事件
    async Prem(id) {
      const res = await getRoleDetailApi(id)
      // console.log(res);
      this.permissionIds = res.permIds
      this.dialog = true
      const add = await permisApi()
      // console.log(add);
      this.permissionList = transListToTreeData(add, 0)
      this.Id = id
    },
    //弹窗确认事件
    async yes() {
      const res = await assignPremApi({
        id: this.Id,
        permIds: this.$refs.permissionTree.getCheckedKeys()
      })
      this.$message.success('分配权限成功')
      this.dialog = false
    }
  }
};
</script>

<style lang="scss" scoped>
.add {
  margin-bottom: 10px;
}
</style>
