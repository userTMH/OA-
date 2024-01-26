<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input placeholder="输入员工姓名" size="mini"></el-input>
        <el-tree :data="data" :props="defaultProps" :expand-on-click-node="false" :default-expand-all="true">
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
            <el-button size="mini" type="primary">添加员工</el-button>
            <el-button size="mini">excel导入</el-button>
            <el-button size="mini">excel导出</el-button>
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
          <el-table-column prop="address" label="工号" sortable>
          </el-table-column>
          <el-table-column prop="formOfEmployment" label="聘用形式">
          </el-table-column>
          <el-table-column prop="departmentName" label="部门">
          </el-table-column>
          <el-table-column prop="timeOfEntry" label="入职时间" sortable>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template v-slot="{ row }">
              <el-button type="text">查看</el-button>
              <el-button type="text">角色</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { departmentApi } from '@/api/department'
import { userApi } from '@/api/employee'
import { transListToTreeData } from '@/utils'
export default {
  name: 'UrsIndex',

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
      }
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
    //右侧列表数据
    async getTable() {
      const res = await userApi(this.query.departmentId)
      console.log(res);
      this.tableData = res.rows
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
