declare module '@wangeditor/editor-for-vue' {
  import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
  import type { DefineComponent, ShallowRef } from 'vue'

  export const Editor: DefineComponent<{
    modelValue?: string
    defaultConfig?: Partial<IEditorConfig>
    mode?: 'default' | 'simple'
  }>

  export const Toolbar: DefineComponent<{
    editor?: IDomEditor | ShallowRef<IDomEditor | null> | null
    defaultConfig?: Partial<IToolbarConfig>
    mode?: 'default' | 'simple'
  }>
}
