<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 查询操作 -->
      <el-input v-model="listQuery.article_id" placeholder="ID" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      &nbsp;
      <el-input v-model="listQuery.author" placeholder="作者" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      &nbsp;
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->

      <el-select v-model="listQuery.map_id" placeholder="地图" clearable class="filter-item" style="width: 130px">
        <el-option v-for="(item, i) in mapTypeOptions" :key="i" :label="item" :value="i" />
      </el-select>
      &nbsp;

      <el-select v-model="listQuery.status" placeholder="审核状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="(item, i) in statusOptions" :key="i" :label="item" :value="i" />
      </el-select>
      &nbsp;

      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      &nbsp;

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button> -->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>

      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
    </div>

    <br>
    <!-- 字段 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- id -->
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.article_id }}</span>
        </template>
      </el-table-column>

      <!-- 姓名 -->
      <el-table-column label="作者" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <!-- 地图名称 -->
      <el-table-column label="地图名" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.map_id | mapTypeFilter }}</span>
          <!-- <span>{{ getMapType(row.map_id) }}</span> -->
          <!-- <span>{{ row.map_id }}</span> -->
        </template>
      </el-table-column>

      <!-- 班主任 -->
      <el-table-column label="班主任" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teacher }}</span>
        </template>
      </el-table-column>

      <!-- 毕业时间 -->
      <el-table-column label="毕业时间" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>

      <!-- 联系方式 -->
      <el-table-column label="联系方式" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.contact }}</span>
        </template>
      </el-table-column>

      <!-- 想说的话 -->
      <el-table-column label="想说的话" min-width="180px">
        <template slot-scope="{row}">
          <!-- <span>{{ row.saying }}</span> -->
          <span v-html="row.saying"></span>
        </template>
      </el-table-column>

      <!-- 展示图片 -->
      <el-table-column label="展示图片" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.image_url }}</span>
          <!-- <img :src="row.image_url"/> -->
        </template>
      </el-table-column>

      <!-- 审核状态 -->
      <el-table-column label="Status" class-name="status-col" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusOptionFilter }}
          </el-tag>
          <!-- <span>{{ getStatusOption(row.status) }}</span> -->
          <!-- <span>{{ row.status }}</span> -->
        </template>
      </el-table-column>
      
      <!-- <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column> -->

      <el-table-column label="Actions" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button> -->
          <el-button v-if="row.status!=2" size="mini" type="success" @click="handleModifyStatus(row,2)">
            已审核
          </el-button>
          <el-button v-if="row.status!=1" size="mini" @click="handleModifyStatus(row,1)">
            待审核
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 翻页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    
    <!-- 修改窗口 -->
    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>

        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog> -->

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { fetchList, updateStatus, deleteArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { status } from 'nprogress'
// import func from 'vue-editor-bridge'
// import { map } from 'mock/user'

// arr to obj, such as { CN : "China", US : "USA" }
// const mapTypeKeyValue = mapTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

const mapTypeOptions = ['全部地图', '操场', '初中部', '高中部', '小学部', '办公楼', '实验楼', '攀峰石', '宣传栏', '东门', '西门', '南门', '游泳池']
const statusOptions = ['全部状态', '待审核', '已审核']

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'info',
        2: 'success',
        // deleted: 'danger'
      }
      return statusMap[status]
    },
    statusOptionFilter(status) {
      return statusOptions[status]
    },
    mapTypeFilter(map_id) {
      return mapTypeOptions[map_id]
    }
  },
  //声明成员变量
  data() {
    return {
      tableKey: 0,
      list: null, //所有数据的响应结果
      total: 0, //总数据量
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        // importance: undefined,
        article_id: undefined, //id过滤（可选）
        author: undefined, //作者过滤（可选）
        map_id: undefined, //地图过滤（可选）
        status: undefined, //审核状态过滤 (可选)
        sort: '+id'
      },
      // importanceOptions: [1, 2, 3],
      mapTypeOptions,
      sortOptions: [{ label: 'ID升序', key: '+id' }, { label: 'ID降序', key: '-id' }],
      statusOptions,
      // showReviewer: false,
      temp: {
        // id: undefined,
        article_id: undefined,
        author: '',
        teacher: '',
        // importance: 1,
        // remark: '',
        // timestamp: new Date(),
        // title: '',
        date: '',
        contact: '',
        saying: '',
        image_url: '',
        map_id: undefined,
        status: undefined
        // status: 'published',
        // type: ''
      },
      // dialogFormVisible: false,
      // dialogStatus: '',
      // textMap: {
      //   update: 'Edit',
      //   create: 'Create'
      // },
      // dialogPvVisible: false,
      // pvData: [],
      // rules: {
      //   type: [{ required: true, message: 'type is required', trigger: 'change' }],
      //   timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
      //   title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      // },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items //获取响应items
        this.total = response.data.total //获取响应total
        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      updateStatus(row.article_id, status).then(response => {
          this.$message({
          message: '操作Success',
          type: 'success'
        })
        row.status = status
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        // id: undefined,
        article_id: undefined,
        author: '',
        teacher: '',
        // importance: 1,
        // remark: '',
        // timestamp: new Date(),
        // title: '',
        date: '',
        contact: '',
        saying: '',
        image_url: '',
        map_id: undefined,
        status: undefined
        // status: 'published',
        // type: ''
      }
    },
    // handleCreate() {
    //   this.resetTemp()
    //   this.dialogStatus = 'create'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // createData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
    //       this.temp.author = 'vue-element-admin'
    //       createArticle(this.temp).then(() => {
    //         this.list.unshift(this.temp)
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: 'Success',
    //           message: 'Created Successfully',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // },
    // handleUpdate(row) {
    //   this.temp = Object.assign({}, row) // copy obj
    //   this.temp.timestamp = new Date(this.temp.timestamp)
    //   this.dialogStatus = 'update'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // updateData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       const tempData = Object.assign({}, this.temp)
    //       tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
    //       updateArticle(tempData).then(() => {
    //         const index = this.list.findIndex(v => v.id === this.temp.id)
    //         this.list.splice(index, 1, this.temp)
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: 'Success',
    //           message: 'Update Successfully',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // },
    handleDelete(row, index) {
      deleteArticle(row.article_id).then(response => {
          this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
          this.list.splice(index, 1)
      })
    },
    // handleFetchPv(pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData
    //     this.dialogPvVisible = true
    //   })
    // },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '作者', '地图名', '班主任', '毕业时间', '联系方式', '想说的话', '图片地址', '审核状态']
        const filterVal = ['article_id', 'author', 'map_id', 'teacher', 'date', 'contact', 'saying', 'image_url', "status"]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
          if (j === 'map_id') {
            return this.getMapType(v[j])
          } else if (j === 'status') {
            return this.getStatusOption(v[j])
          } else if (j === 'saying') {
            return v[j].replace(/<br>/g, "\n"); 
          }
          else {
            return v[j]
          }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    getMapType: function(map_id) { //输入1-地图数
      return this.mapTypeOptions[map_id]
    },
    getStatusOption: function(status) { //输入1,2 (1表示未审核，2表示已审核)
      return this.statusOptions[status]
    },    
  }
}
</script>
