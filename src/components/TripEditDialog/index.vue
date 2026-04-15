<template>
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑行程' : '创建新行程'" width="600px" @close="handleClose">
        <el-form :model="tripForm" :rules="rules" ref="tripFormRef" label-width="100px">
            <el-form-item label="行程名称" prop="trip_name">
                <el-input v-model="tripForm.trip_name" placeholder="请输入行程名称" />
            </el-form-item>

            <el-form-item label="出发地" prop="origin">
                <el-input v-model="tripForm.origin" placeholder="请输入出发地" />
            </el-form-item>

            <el-form-item label="目的地" prop="destination">
                <el-input v-model="tripForm.destination" placeholder="请输入目的地" />
            </el-form-item>

            <el-form-item label="开始日期" prop="start_date">
                <el-date-picker v-model="tripForm.start_date" type="date" placeholder="选择开始日期" style="width: 100%" />
            </el-form-item>

            <el-form-item label="结束日期" prop="end_date">
                <el-date-picker v-model="tripForm.end_date" type="date" placeholder="选择结束日期" style="width: 100%" />
            </el-form-item>

            <el-form-item label="出行人数" prop="travelers">
                <el-input-number v-model="tripForm.travelers" :min="1" :max="20" />
            </el-form-item>

            <el-form-item label="预算" prop="budget">
                <el-input-number v-model="tripForm.budget" :min="0" :precision="2" />
            </el-form-item>

            <el-form-item label="交通方式" prop="transport">
                <el-select v-model="tripForm.transport" placeholder="请选择交通方式">
                    <el-option label="飞机" value="飞机" />
                    <el-option label="火车" value="火车" />
                    <el-option label="汽车" value="汽车" />
                    <el-option label="自驾" value="自驾" />
                </el-select>
            </el-form-item>

            <el-form-item label="行程状态" prop="status">
                <el-select v-model="tripForm.status" placeholder="请选择行程状态">
                    <el-option label="规划中" value="planning" />
                    <el-option label="进行中" value="ongoing" />
                    <el-option label="已完成" value="completed" />
                    <el-option label="已取消" value="cancelled" />
                </el-select>
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="submitting">
                {{ isEdit ? '保存' : '创建' }}
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { createTrip, updateTrip } from '@/api/trip'
import { useUserStore } from '@/stores/UserStore'

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    trip: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['update:visible', 'success'])

const userStore = useUserStore()
const tripFormRef = ref(null)
const submitting = ref(false)

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

const isEdit = computed(() => !!props.trip?.id)

const tripForm = reactive({
    trip_name: '',
    origin: '',
    destination: '',
    start_date: '',
    end_date: '',
    travelers: 1,
    budget: 0,
    transport: '',
    status: 'planning'
})

const rules = {
    trip_name: [{ required: true, message: '请输入行程名称', trigger: 'blur' }],
    destination: [{ required: true, message: '请输入目的地', trigger: 'blur' }],
    start_date: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
    end_date: [{ required: true, message: '请选择结束日期', trigger: 'change' }]
}

watch(() => props.visible, (val) => {
    if (val) {
        if (props.trip) {
            Object.assign(tripForm, {
                trip_name: props.trip.trip_name || '',
                origin: props.trip.origin || '',
                destination: props.trip.destination || '',
                start_date: props.trip.start_date || '',
                end_date: props.trip.end_date || '',
                travelers: props.trip.travelers || 1,
                budget: props.trip.budget || 0,
                transport: props.trip.transport || '',
                status: props.trip.status || 'planning'
            })
        } else {
            resetForm()
        }
    }
})

const resetForm = () => {
    Object.assign(tripForm, {
        trip_name: '',
        origin: '',
        destination: '',
        start_date: '',
        end_date: '',
        travelers: 1,
        budget: 0,
        transport: '',
        status: 'planning'
    })
    if (tripFormRef.value) {
        tripFormRef.value.resetFields()
    }
}

const handleClose = () => {
    resetForm()
}

const formatDateForSubmit = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const handleSubmit = async () => {
    if (!tripFormRef.value) return

    await tripFormRef.value.validate(async (valid) => {
        if (valid) {
            submitting.value = true
            try {
                const data = {
                    ...tripForm,
                    start_date: formatDateForSubmit(tripForm.start_date),
                    end_date: formatDateForSubmit(tripForm.end_date),
                    user_id: userStore.id
                }

                let res
                if (isEdit.value) {
                    res = await updateTrip(props.trip.id, data)
                } else {
                    res = await createTrip(data)
                }

                if (res.status === 0) {
                    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
                    dialogVisible.value = false
                    emit('success')
                } else {
                    ElMessage.error(res.message)
                }
            } catch (error) {
                console.error('操作失败:', error)
                ElMessage.error('操作失败')
            } finally {
                submitting.value = false
            }
        }
    })
}
</script>
