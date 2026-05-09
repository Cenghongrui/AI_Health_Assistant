<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>

    <el-table :data="tableData" style="width: 100%;margin-top: 25px;">
      <el-table-column prop="title" label="文章标题" fixed="left" width="400">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-icon>
              <timer />
            </el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="categoryName" label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-icon>
              <clock />
            </el-icon>
            <span>{{ scope.row.categoryName }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="authorName" label="作者" width="150" />
      <el-table-column prop="readCount" label="阅读量" width="150" />
      <el-table-column prop="updatedAt" label="更新时间" width="150" />

      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" text type="primary">编辑</el-button>
          <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0 || scope.row.status === 2" text
            type="success">发布</el-button>
          <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status === 1" text
            type="warning">下线</el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
        </template>
      </el-table-column>


    </el-table>

    <el-pagination layout="prev, pager, next" :total="pagination.total" :page-size="pagination.size"
      :current-page="pagination.currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <ArticleDialog v-model="dialogVisible" :categoryList="categoryList" :currentArticle="currentArticle"
      @success="handleSuccess"></ArticleDialog>

  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue'
  import PageHead from "@/components/PageHead.vue";
  import TableSearch from "@/components/TableSearch.vue";
  import { categoryTree, articlePage, getArticleDetail, changeArticleStatus, deleteArticle } from "@/api/admin";
  import { Clock } from '@element-plus/icons-vue';
  import ArticleDialog from "@/components/ArticleDialog.vue";
  import { ElMessageBox, ElMessage } from 'element-plus'



  // 分类映射
  const categoryMap = reactive({});
  //分类列表
  const categoryList = ref<any[]>([]);
  //列表数据
  const tableData = ref<any[]>([])


  // 新增和编辑
  const dialogVisible = ref(false)
  const currentArticle = ref<any>(null)
  const handleSuccess = () => {
    dialogVisible.value = false
    // 刷新列表
    handleSearch({})
  }
  const handleEdit = (row: any) => {
    if (!row.id) {
      // 新增
      currentArticle.value = null
      dialogVisible.value = true
    } else {
      // 编辑
      currentArticle.value = row
      getArticleDetail(row.id).then((res: any) => {
        console.log(res, '文章详情')
        currentArticle.value = res
        dialogVisible.value = true
      })
    }

  }


  // 发布
  const handlePublish = (row: any) => {
    ElMessageBox.confirm(`确认发布文章${row.title}吗？`, '确认', {
      confirmButtonText: '确认发布',
      cancelButtonText: '取消',
      type: 'info'
    }).then(() => {
      // 发布文章
      changeArticleStatus(row.id, { status: 1 }).then((res: any) => {
        ElMessage.success('文章发布成功')
        handleSearch({})
      })
    })
  }


  // 下线
  const handleUnpublish = (row: any) => {
    ElMessageBox.confirm(`确认下线文章${row.title}吗？`, '确认', {
      confirmButtonText: '确认下线',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 下线文章
      changeArticleStatus(row.id, { status: 2 }).then((res: any) => {
        ElMessage.success('文章下线成功')
        handleSearch({})
      })
    })
  }

  // 删除
  const handleDelete = (row: any) => {
    ElMessageBox.confirm(`确认删除文章${row.title}吗？`, '确认', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'danger'
    }).then(() => {
      // 删除文章
      deleteArticle(row.id).then((res: any) => {
        ElMessage.success('文章删除成功')
        handleSearch({})
      })
    })
  }


  onMounted(async () => {
    const res = await categoryTree()
    categoryList.value = res.map((item: any) => {
      categoryMap[item.id] = item.categoryName
      return {
        label: item.categoryName,
        value: item.id
      }
    })
    formItem[1].options = categoryList.value


    handleSearch({})
  })

  const formItem = [
    { comp: 'input', prop: 'title', label: '文章标题', placeholder: '请输入文章标题' },
    { comp: 'select', prop: 'categoryId', label: '分类', placeholder: '请选择分类', options: [] as any[] },
    {
      comp: 'select', prop: 'status', label: '状态', placeholder: '请选择状态', options: [
        {
          label: '草稿',
          value: 0
        },
        {
          label: '已发布',
          value: 1
        },
        {
          label: '已下线',
          value: 2
        },
      ]
    },

  ]

  // 分页参数
  const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0,
  })


  // 搜索
  const handleSearch = async (formData: any) => {
    console.log(formData)
    const params = {
      ...pagination,
      ...formData
    }

    const { records, total } = await articlePage(params)
    tableData.value = records
    pagination.total = total
  }

  const handleSizeChange = (val: number) => {
    pagination.size = val
    handleSearch({})
  }

  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val
    handleSearch({})
  }


</script>
