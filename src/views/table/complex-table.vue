<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 查询操作 -->
      <el-input v-model="listQuery.articleId" placeholder="ID" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      &nbsp;
      <el-input v-model="listQuery.author" placeholder="作者" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      &nbsp;
      <el-select v-model="listQuery.mapId" placeholder="地图" clearable class="filter-item" style="width: 130px">
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
          <span>{{ row.articleId }}</span>
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
          <span>{{ row.mapId | mapTypeFilter }}</span>
          <!-- <span>{{ getMapType(row.mapId) }}</span> -->
          <!-- <span>{{ row.mapId }}</span> -->
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
      <el-table-column label="展示图片" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.imageUrl }}</span>
          <!-- <img :src="row.imageUrl"/> -->
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
    
  </div>
</template>

<script>
import { fetchList, updateStatus, deleteArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
    mapTypeFilter(mapId) {
      return mapTypeOptions[mapId]
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
        articleId: undefined, //id过滤（可选）
        author: undefined, //作者过滤（可选）
        mapId: undefined, //地图过滤（可选）
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
        articleId: undefined,
        author: '',
        teacher: '',
        date: '',
        contact: '',
        saying: '',
        imageUrl: '',
        mapId: undefined,
        status: undefined
      },
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
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      updateStatus(row.articleId, status).then(response => {
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
        articleId: undefined,
        author: '',
        teacher: '',
        date: '',
        contact: '',
        saying: '',
        imageUrl: '',
        mapId: undefined,
        status: undefined
      }
    },
    handleDelete(row, index) {
      deleteArticle(row.articleId).then(response => {
          this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
          this.list.splice(index, 1)
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '作者', '地图名', '班主任', '毕业时间', '联系方式', '想说的话', '图片地址', '审核状态']
        const filterVal = ['articleId', 'author', 'mapId', 'teacher', 'date', 'contact', 'saying', 'imageUrl', "status"]
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
          if (j === 'mapId') {
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
    getMapType: function(mapId) { //输入1-地图数
      return this.mapTypeOptions[mapId]
    },
    getStatusOption: function(status) { //输入1,2 (1表示未审核，2表示已审核)
      return this.statusOptions[status]
    },    
  }
}
</script>
