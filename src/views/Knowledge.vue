<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="handleEdit()">新增</el-button>
      </template>
    </PageHead>

    <TableSearch :formItem="formItem" @search="handleSearch" />

    <el-table :data="tableData" style="width: 100%; margin-top: 25px;">
      <el-table-column prop="title" label="文章标题" fixed="left" width="400">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-icon>
              <Timer />
            </el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="categoryName" label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-icon>
              <Clock />
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
          <el-button
            @click="handlePublish(scope.row)"
            v-if="scope.row.status === 0 || scope.row.status === 2"
            text
            type="success"
          >
            发布
          </el-button>
          <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status === 1" text type="warning">下线</el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.size"
      :current-page="pagination.currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <ArticleDialog
      v-model="dialogVisible"
      :categoryList="categoryList"
      :currentArticle="currentArticle"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Clock, Timer } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { categoryTree, articlePage, getArticleDetail, changeArticleStatus, deleteArticle } from '@/api/admin'
import type {
  ArticleDetail,
  ArticleListItem,
  CategoryOption,
  PaginationState,
  SearchFormModel,
  TableSearchItem,
} from '@/interface'

const categoryMap = reactive<Record<number, string>>({})
const categoryList = ref<CategoryOption[]>([])
const tableData = ref<ArticleListItem[]>([])

const dialogVisible = ref(false)
const currentArticle = ref<ArticleDetail | null>(null)

const handleSuccess = () => {
  dialogVisible.value = false
  handleSearch({})
}

const handleEdit = (row?: ArticleListItem) => {
  if (!row?.id) {
    currentArticle.value = null
    dialogVisible.value = true
    return
  }

  currentArticle.value = row as ArticleDetail
  getArticleDetail(row.id).then((res) => {
    currentArticle.value = res
    dialogVisible.value = true
  })
}

const handlePublish = (row: ArticleListItem) => {
  ElMessageBox.confirm(`确认发布文章 ${row.title} 吗？`, '确认', {
    confirmButtonText: '确认发布',
    cancelButtonText: '取消',
    type: 'info',
  }).then(() => {
    changeArticleStatus(row.id, { status: 1 }).then(() => {
      ElMessage.success('文章发布成功')
      handleSearch({})
    })
  })
}

const handleUnpublish = (row: ArticleListItem) => {
  ElMessageBox.confirm(`确认下线文章 ${row.title} 吗？`, '确认', {
    confirmButtonText: '确认下线',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    changeArticleStatus(row.id, { status: 2 }).then(() => {
      ElMessage.success('文章下线成功')
      handleSearch({})
    })
  })
}

const handleDelete = (row: ArticleListItem) => {
  ElMessageBox.confirm(`确认删除文章 ${row.title} 吗？`, '确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteArticle(row.id).then(() => {
      ElMessage.success('文章删除成功')
      handleSearch({})
    })
  })
}

const formItem = reactive<TableSearchItem[]>([
  { comp: 'input', prop: 'title', label: '文章标题', placeholder: '请输入文章标题' },
  { comp: 'select', prop: 'categoryId', label: '分类', placeholder: '请选择分类', options: [] },
  {
    comp: 'select',
    prop: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '草稿', value: 0 },
      { label: '已发布', value: 1 },
      { label: '已下线', value: 2 },
    ],
  },
])

const pagination = reactive<PaginationState>({
  currentPage: 1,
  size: 10,
  total: 0,
})

const handleSearch = async (formData: SearchFormModel = {}) => {
  const params = {
    ...pagination,
    ...formData,
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

onMounted(async () => {
  const res = await categoryTree()
  categoryList.value = res.map((item) => {
    categoryMap[item.id] = item.categoryName
    return {
      label: item.categoryName,
      value: item.id,
    }
  })

  const categoryField = formItem[1]
  if (categoryField) {
    categoryField.options = categoryList.value
  }

  handleSearch({})
})
</script>
