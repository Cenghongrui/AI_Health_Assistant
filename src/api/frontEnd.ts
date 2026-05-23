import service from '@/utils/request'
import type {
  ArticleDetail,
  ArticleListItem,
  ArticlePageQuery,
  ChatMessage,
  ChatSession,
  EmotionAnalysis,
  EmotionDiaryRequest,
  Id,
  PageResult,
  RegisterRequest,
  SessionPageQuery,
  StartSessionRequest,
  StartSessionResult,
} from '@/interface'

export function register(data: RegisterRequest): Promise<unknown> {
  return service.post<unknown, RegisterRequest>('/user/add', data)
}

export function startSession(data: StartSessionRequest): Promise<StartSessionResult> {
  return service.post<StartSessionResult, StartSessionRequest>('/psychological-chat/session/start', data)
}

export function getSessionHistory(params: SessionPageQuery): Promise<PageResult<ChatSession>> {
  return service.get<PageResult<ChatSession>>('/psychological-chat/sessions', { params })
}

export function deleteSession(sessionId: Id): Promise<unknown> {
  return service.delete(`/psychological-chat/sessions/${sessionId}`)
}

export function getSessionMessages(sessionId: Id): Promise<ChatMessage[]> {
  return service.get<ChatMessage[]>(`/psychological-chat/sessions/${sessionId}/messages`)
}

export function getSessionEmotion(sessionId: Id): Promise<EmotionAnalysis> {
  return service.get<EmotionAnalysis>(`/psychological-chat/session/${sessionId}/emotion`)
}

export function addEmotionDiary(data: EmotionDiaryRequest): Promise<unknown> {
  return service.post<unknown, EmotionDiaryRequest>('/emotion-diary', data)
}

export function getKnowledgeList(params: ArticlePageQuery): Promise<PageResult<ArticleListItem>> {
  return service.get<PageResult<ArticleListItem>>('/knowledge/article/page', { params })
}

export function getArticleDetail(id: Id): Promise<ArticleDetail> {
  return service.get<ArticleDetail>(`/knowledge/article/${id}`)
}
