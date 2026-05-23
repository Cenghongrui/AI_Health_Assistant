<template>
  <el-dialog :title="isEdit ? '编辑文章' : '新增文章'" v-model="dialogVisible" width="60%" @close="handleClose">
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable />
      </el-form-item>

      <el-form-item label="文章分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择文章分类">
          <el-option v-for="item in props.categoryList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="摘要" prop="summary">
        <el-input
          type="textarea"
          v-model="formData.summary"
          placeholder="请输入摘要"
          maxlength="1000"
          show-word-limit
          clearable
          rows="4"
        />
      </el-form-item>

      <el-form-item label="标签" prop="tags">
        <el-select v-model="formData.tagArray" placeholder="请输入或选择文章标签" multiple filterable allow-create style="width: 100%;">
          <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
        </el-select>
      </el-form-item>

      <el-form-item label="封面" prop="coverImage">
        <div class="cover-upload">
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            accept=".jpg,.png"
            :show-file-list="false"
          >
            <div v-if="!imageURL" class="cover-placeholder">
              <p>点击上传封面</p>
            </div>
            <img v-else :src="imageURL" class="cover-image" alt="封面图片">
            <template #tip>
              <div class="el-upload__tip">请上传 jpg/png 格式，大小不超过 5MB。</div>
            </template>
          </el-upload>

          <div v-if="imageURL">
            <el-button type="danger" size="small" @click="removeCover">移除封面</el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <RichTextEditor
          v-model="formData.content"
          placeholder="请输入文章内容"
          :maxCharCount="2000"
          @change="handleContentChange"
          @created="handleEditorCreated"
          min-height="400px"
        />
      </el-form-item>
    </el-form>

    <div v-if="btnPreview">
      <h2>预览</h2>
      <div v-html="formData.content"></div>
    </div>

    <template #footer>
      <el-button @click="btnPreview = !btnPreview">{{ btnPreview ? '隐藏预览' : '预览效果' }}</el-button>
      <el-button type="danger" @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleContentSubmit" :loading="loading">
        {{ isEdit ? '更新文章' : '创建文章' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { uploadFile, createArticle, updateArticle } from '@/api/admin'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, UploadRawFile, UploadRequestOptions, UploadUserFile } from 'element-plus'
import type { IDomEditor } from '@wangeditor/editor'
import { API_BASE_URL } from '@/config/index'
import RichTextEditor from '@/components/RichTextEditor.vue'
import type {
  ArticleDetail,
  ArticleFormModel,
  ArticleSaveRequest,
  CategoryOption,
  RichTextChangePayload,
} from '@/interface'

const props = withDefaults(defineProps<{
  modelValue: boolean
  categoryList: CategoryOption[]
  currentArticle: ArticleDetail | null
}>(), {
  modelValue: false,
  categoryList: () => [],
  currentArticle: null,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'success'): void
}>()

const createEmptyForm = (): ArticleFormModel => ({
  title: '',
  content: '',
  coverImage: '',
  categoryId: 1,
  summary: '',
  tags: '',
  tagArray: [],
  id: '',
})

const formData = reactive<ArticleFormModel>(createEmptyForm())
const formRef = ref<FormInstance>()
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const isEdit = computed(() => !!props.currentArticle?.id)

const toTagArray = (article: ArticleDetail): string[] => {
  if (article.tagArray?.length) {
    return article.tagArray
  }

  return article.tags ? article.tags.split(',').filter(Boolean) : []
}

watch(() => props.currentArticle, (newVal) => {
  if (newVal && dialogVisible.value) {
    nextTick(() => {
      Object.assign(formData, createEmptyForm(), newVal, {
        tagArray: toTagArray(newVal),
      })
      businessId.value = String(newVal.id)
      imageURL.value = newVal.coverImage ? API_BASE_URL + newVal.coverImage : ''
    })
  }
})

const handleClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, createEmptyForm())
  businessId.value = ''
  fileList.value = []
  removeCover()
  dialogVisible.value = false
}

const imageURL = ref('')
const fileList = ref<UploadUserFile[]>([])
const beforeUpload = (file: UploadRawFile) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  if ((!isJPG && !isPNG) || file.size > 5000000) {
    ElMessage.error('请上传 jpg/png 格式且大小不超过 5MB 的图片')
    return false
  }

  return true
}

const businessId = ref('')
const handleUploadRequest = async ({ file }: UploadRequestOptions) => {
  businessId.value = crypto.randomUUID()

  const fileRes = await uploadFile(file, {
    businessId: businessId.value,
  })

  imageURL.value = API_BASE_URL + fileRes.filePath
  formData.coverImage = fileRes.filePath
}

const removeCover = () => {
  imageURL.value = ''
  formData.coverImage = ''
}

const rules = reactive<FormRules<ArticleFormModel>>({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '文章标题最多 200 个字符', trigger: 'blur' },
  ],
  categoryId: [
    { required: true, message: '请选择文章分类', trigger: 'blur' },
  ],
  coverImage: [
    { required: true, message: '请上传封面图片', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { max: 2000, message: '文章内容最多 2000 个字符', trigger: 'blur' },
  ],
})

const commonTags: string[] = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠',
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧',
]

const handleContentChange = (val: RichTextChangePayload) => {
  formData.content = val.html
}

const editorInstance = ref<IDomEditor | null>(null)
const handleEditorCreated = (editor: IDomEditor) => {
  editorInstance.value = editor
  if (formData.content) {
    nextTick(() => {
      editor.setHtml(formData.content)
    })
  }
}

const btnPreview = ref(false)
const loading = ref(false)

const buildSubmitData = (): ArticleSaveRequest => ({
  id: isEdit.value ? props.currentArticle?.id : businessId.value,
  title: formData.title,
  content: formData.content,
  coverImage: formData.coverImage,
  categoryId: formData.categoryId,
  summary: formData.summary,
  tags: formData.tagArray.join(','),
})

const handleContentSubmit = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  const submitData = buildSubmitData()

  try {
    if (isEdit.value && props.currentArticle?.id) {
      await updateArticle(props.currentArticle.id, submitData)
      ElMessage.success('文章更新成功')
    } else {
      await createArticle(submitData)
      ElMessage.success('文章发布成功')
    }

    emit('success')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.cover-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 14px;
  color: #606266;
  width: 200px;
  height: 120px;
}

.cover-image {
  width: 200px;
  object-fit: cover;
}

.el-upload__tip {
  font-size: 10px;
  color: #95979c;
}
</style>
