import service from '@/utils/request'
import type {
  AnalysisOverview,
  ArticleDetail,
  ArticleListItem,
  ArticlePageQuery,
  ArticleSaveRequest,
  ArticleStatusRequest,
  Category,
  ChatMessage,
  ChatSession,
  EmotionDiary,
  EmotionDiaryQuery,
  Id,
  LoginRequest,
  LoginResult,
  PageResult,
  PaginationQuery,
  UploadBusinessInfo,
  UploadFileResult,
} from '@/interface'

export function login(data: LoginRequest): Promise<LoginResult> {
  return service.post<LoginResult, LoginRequest>('/user/login', data)
}

export function categoryTree(): Promise<Category[]> {
  return service.get<Category[]>('/knowledge/category/tree')
}

export function articlePage(params: ArticlePageQuery): Promise<PageResult<ArticleListItem>> {
  return service.get<PageResult<ArticleListItem>>('/knowledge/article/page', { params })
}

export function uploadFile(file: Blob, businessInfo: UploadBusinessInfo): Promise<UploadFileResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessField', 'cover')

  return service.post<UploadFileResult, FormData>('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function createArticle(data: ArticleSaveRequest): Promise<ArticleDetail> {
  return service.post<ArticleDetail, ArticleSaveRequest>('/knowledge/article', data)
}

export function getArticleDetail(id: Id): Promise<ArticleDetail> {
  return service.get<ArticleDetail>(`/knowledge/article/${id}`)
}

export function updateArticle(id: Id, data: ArticleSaveRequest): Promise<ArticleDetail> {
  return service.put<ArticleDetail, ArticleSaveRequest>(`/knowledge/article/${id}`, data)
}

export function changeArticleStatus(id: Id, data: ArticleStatusRequest): Promise<ArticleDetail> {
  return service.put<ArticleDetail, ArticleStatusRequest>(`/knowledge/article/${id}/status`, data)
}

export function deleteArticle(id: Id): Promise<unknown> {
  return service.delete(`/knowledge/article/${id}`)
}

export function getConsultationsPage(params: PaginationQuery): Promise<PageResult<ChatSession>> {
  return service.get<PageResult<ChatSession>>('/psychological-chat/sessions', { params })
}

export function getSessionDetail(sessionId: Id): Promise<ChatMessage[]> {
  return service.get<ChatMessage[]>(`/psychological-chat/sessions/${sessionId}/messages`)
}

export function getEmotionPage(params: EmotionDiaryQuery): Promise<PageResult<EmotionDiary>> {
  return service.get<PageResult<EmotionDiary>>('/emotion-diary/admin/page', { params })
}

export function deleteEmotion(id: Id): Promise<unknown> {
  return service.delete(`/emotion-diary/admin/${id}`)
}

export function getAnalysisOverview(): Promise<AnalysisOverview> {
  return service.get<AnalysisOverview>('/data-analytics/overview')
}

export function logout(): Promise<unknown> {
  return service.post('/user/logout')
}
