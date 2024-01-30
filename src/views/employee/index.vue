<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input v-model="query.keyword" placeholder="输入员工姓名" size="mini" @change="handleSearch"></el-input>
        <el-tree :data="data" :props="defaultProps" :expand-on-click-node="false" :default-expand-all="true"
          highlight-current node-key="id" @current-change="selectNode">
          <template v-slot="{ node, data }">
            <el-row type="flex" justify="space-between" align="middle" style="width: 100%;height: 30px;">
              <el-col>{{ data.name }}</el-col>
            </el-row>
          </template>
        </el-tree>
      </div>
      <div class="right">
        <div style="display: flex;justify-content: space-between;">
          <el-button size="mini">群发通知</el-button>
          <div>
            <el-button size="mini" type="primary" @click="add">添加员工</el-button>
            <el-button size="mini" @click="dialogVisible = true">excel导入</el-button>
            <el-button size="mini" @click="exportEmployee">excel导出</el-button>
          </div>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="staffPhoto" label="头像">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto"></el-avatar>
              <el-avatar v-else> {{ row.username.charAt(2) }} </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名">
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" sortable>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable>
          </el-table-column>
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{ row }">
              <span>{{ row.formOfEmployment == 1 ? '正式' : '非正式' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门">
          </el-table-column>
          <el-table-column prop="timeOfEntry" label="入职时间" sortable>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template v-slot="{ row }">
              <el-button size="mini" type="text" @click="handleRouter(row.id)">查看</el-button>
              <el-button size="mini" type="text" @click="role(row.id)">角色</el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="handleDelete(row.id)">
                <el-button slot="reference" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="padding-top: 20px" type="flex" justify="center" align="midlle">
          <el-pagination :current-page="query.page" :page-size="query.pagesize" layout="total, prev, pager, next"
            :total="total" @current-change="handleCurrentChange" />
        </el-row>
      </div>
    </div>
    <ImportExcel :show-dialog.sync="dialogVisible" @uploadSuccess="getTable" />
    <!-- 角色弹窗 -->
    <el-dialog title="分配角色" :visible.sync="dialog" width="50%" :before-close="handleClose">
      <div>
        <el-checkbox v-for="(item, index) in dialogList" :key="index" :label="item.id">{{ item.name }}</el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialog = false">确 定</el-button>
        <el-button size="mini" @click="dialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { departmentApi } from '@/api/department'
import { userApi, exportEmployeeApi, removeEmployeeApi, userListApi } from '@/api/employee'
import { enabledApi } from '@/api/role'
import { transListToTreeData } from '@/utils'
import FileSaver from 'file-saver'
import _ from 'lodash'
import ImportExcel from './components/import-excel'
export default {
  name: 'UrsIndex',
  components: {
    ImportExcel
  },
  data() {
    return {
      //列表数据
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      //右侧数据
      tableData: [],
      query: {
        page: 1,
        pagesize: 10,
        keyword: "",
        departmentId: 1
      },
      //弹窗状态
      dialogVisible: false,
      total: 0,
      //角色弹窗状态
      dialog: false,
      //角色数据
      dialogList: []
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
      this.data = transListToTreeData(res, 0)
      this.getTable()
    },
    //分页
    handleCurrentChange(page) {
      this.query.page = page
      this.getDepartmentApi()
    },
    //右侧列表数据
    async getTable() {
      const res = await userApi(this.query)
      // console.log(res);
      this.total = res.total
      this.tableData = res.rows
    },
    //搜索
    handleSearch() {
      this.query.page = 1
      this.getTable()
    },
    // 设置选中的节点
    selectNode(event) {
      this.query.departmentId = event.id
      this.query.page = 1
      this.getTable()
    },
    //添加员工
    add() {
      this.$router.push('/employee/detail')
    },
    //导入弹窗关闭事件
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    // 删除员工
    async handleDelete(id) {
      await removeEmployeeApi(id)
      if (this.list.length === 1 && this.queryParams.page > 1) {
        this.queryParams.page--
      }
      this.getEmployeList()
      this.$message.success('删除员工成功')
    },
    // 导出文件方法
    async exportEmployee() {
      // 获取流数据
      const res = await exportEmployeeApi()
      console.log('Res=>', res)
      // 将文件流转化成文件并下载
      FileSaver.saveAs(res, '员工信息表.xlsx')
    },
    // 跳转到员工详情页
    handleRouter(id) {
      this.$router.push(`/employee/detail/${id}`)
    },
    //角色事件
    async role(id) {
      const res = await enabledApi()
      // console.log(res);
      this.dialogList = res
      this.dialog = true
      const add = await userListApi(id)
      console.log(add);
    }
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
}

.left {
  width: 20%;
  padding: 20px;
  border-right: 1px solid #ccc;
}

.right {
  width: 80%;
  padding: 20px;
}
</style>
