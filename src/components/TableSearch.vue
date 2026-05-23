<template>
    <el-form ref="ruleFormRef" :model="formData">
        <el-row :gutter="24">
            <template v-for="item in formItemAttrs" :key="item.prop">
                <el-col v-bind="item.col">
                    <el-form-item :label="item.label" :prop="item.prop">
                        <component :is="isComp(item.comp)" :placeholder="item.placeholder"
                            v-model="formData[item.prop]">
                            <template v-if="item.comp === 'select'">
                                <el-option v-for="option in item.options || []" :key="option.value" :label="option.label"
                                    :value="option.value" />
                            </template>
                        </component>
                    </el-form-item>
                </el-col>

            </template>
        </el-row>

        <el-row>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset(ruleFormRef)">重置</el-button>
        </el-row>


    </el-form>
</template>

<script setup lang="ts">
    import { ref, reactive, computed } from 'vue'
    import type { FormInstance } from 'element-plus'
    import type { SearchFormCol, SearchFormModel, TableSearchItem } from '@/interface'

    const props = withDefaults(defineProps<{
        formItem: TableSearchItem[]
    }>(), {
        formItem: () => []
    })

    const emit = defineEmits<{
        (event: 'search', formData: SearchFormModel): void
    }>()

    const defaultCol: SearchFormCol = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }

    const formItemAttrs = computed<TableSearchItem[]>(() => {
        return props.formItem.map((item) => ({
            ...item,
            col: item.col ?? defaultCol,
        }))
    })


    const ruleFormRef = ref<FormInstance>()
    
    const formData = reactive<SearchFormModel>({})
    const isComp = (comp: string) => {
        if (comp === 'input') {
            return 'el-input'
        }
        if (comp === 'select') {
            return 'el-select'
        }

        return 'el-input'
    }

    const handleSearch = () => {
        //console.log(formData)
        emit('search', formData)
    }

    const handleReset = (formRef?: FormInstance) => {
        if(!formRef) return
        formRef.resetFields()
        emit('search', formData)
    }

</script>
