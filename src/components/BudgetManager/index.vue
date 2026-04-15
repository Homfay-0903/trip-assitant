<template>
  <div class="budget-manager">
    <div class="budget-header">
      <h3>预算管理</h3>
      <el-button type="primary" @click="showAddDialog">
        <el-icon>
          <Plus />
        </el-icon>
        记录支出
      </el-button>
    </div>

    <el-row :gutter="20" class="budget-overview">
      <el-col :span="8">
        <el-card class="overview-card">
          <div class="overview-label">总预算</div>
          <div class="overview-value">¥{{ budget }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="overview-card">
          <div class="overview-label">已支出</div>
          <div class="overview-value spent">¥{{ totalExpense }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="overview-card">
          <div class="overview-label">剩余预算</div>
          <div class="overview-value remaining">¥{{ remainingBudget }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="statistics-card">
      <template #header>
        <span>支出统计</span>
      </template>
      <div ref="chartRef" style="height: 300px"></div>
    </el-card>

    <el-card class="expense-list-card">
      <template #header>
        <div class="list-header">
          <span>支出记录</span>
          <el-select v-model="categoryFilter" placeholder="按分类筛选" clearable>
            <el-option label="交通" value="交通" />
            <el-option label="住宿" value="住宿" />
            <el-option label="餐饮" value="餐饮" />
            <el-option label="门票" value="门票" />
            <el-option label="购物" value="购物" />
            <el-option label="其他" value="其他" />
          </el-select>
        </div>
      </template>

      <el-table :data="filteredExpenses" style="width: 100%">
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category_cn || row.category)">
              {{ row.category_cn || row.category }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" />
        <el-table-column prop="expense_date" label="日期" width="120">
          <template #default="{ row }">
            {{ formatDate(row.expense_date) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button text type="primary" @click="editExpense(row)">
              <el-icon>
                <Edit />
              </el-icon>
            </el-button>
            <el-button text type="danger" @click="deleteExpense(row.id)">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingExpense ? '编辑支出' : '记录支出'" width="500px">
      <el-form :model="expenseForm" :rules="rules" ref="expenseFormRef" label-width="80px">
        <el-form-item label="分类" prop="category">
          <el-select v-model="expenseForm.category" placeholder="请选择分类">
            <el-option label="交通" value="交通" />
            <el-option label="住宿" value="住宿" />
            <el-option label="餐饮" value="餐饮" />
            <el-option label="门票" value="门票" />
            <el-option label="购物" value="购物" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>

        <el-form-item label="金额" prop="amount">
          <el-input-number v-model="expenseForm.amount" :min="0" :precision="2" />
        </el-form-item>

        <el-form-item label="说明">
          <el-input v-model="expenseForm.description" placeholder="请输入说明" />
        </el-form-item>

        <el-form-item label="日期" prop="expense_date">
          <el-date-picker v-model="expenseForm.expense_date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitExpense" :loading="submitting">
          {{ editingExpense ? '保存' : '添加' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import {
  getExpenseList,
  getExpenseStatistics,
  createExpense,
  updateExpense,
  deleteExpense as deleteExpenseApi
} from '@/api/expense'

const props = defineProps({
  tripId: {
    type: [String, Number],
    required: true
  },
  budget: {
    type: Number,
    default: 0
  }
})

const loading = ref(false)
const submitting = ref(false)
const expenses = ref([])
const statistics = ref({})
const categoryFilter = ref('')
const dialogVisible = ref(false)
const editingExpense = ref(null)
const expenseFormRef = ref(null)
const chartRef = ref(null)
let chartInstance = null

const expenseForm = reactive({
  category: '',
  amount: 0,
  description: '',
  expense_date: ''
})

const rules = {
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  expense_date: [{ required: true, message: '请选择日期', trigger: 'change' }]
}

const totalExpense = computed(() => {
  return expenses.value.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
})

const remainingBudget = computed(() => {
  return Math.max(0, props.budget - totalExpense.value)
})

const filteredExpenses = computed(() => {
  if (!categoryFilter.value) return expenses.value
  return expenses.value.filter(expense =>
    (expense.category_cn || expense.category) === categoryFilter.value
  )
})

const loadExpenses = async () => {
  loading.value = true
  try {
    const [listRes, statsRes] = await Promise.all([
      getExpenseList(props.tripId),
      getExpenseStatistics(props.tripId)
    ])

    if (listRes && listRes.status === 0) {
      expenses.value = listRes.data?.list || []
    } else {
      expenses.value = []
    }

    if (statsRes && statsRes.status === 0) {
      statistics.value = statsRes.data || {}
      await nextTick()
      renderChart()
    }
  } catch (error) {
    console.error('加载支出数据失败:', error)
    ElMessage.error('加载支出数据失败')
    expenses.value = []
  } finally {
    loading.value = false
  }
}

const renderChart = () => {
  if (!chartRef.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value)

  const categoryStats = statistics.value.category_statistics || []
  const chartData = categoryStats.map(item => ({
    name: item.category_cn || item.category,
    value: item.total_amount
  }))

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '支出分类',
        type: 'pie',
        radius: '50%',
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

const showAddDialog = () => {
  editingExpense.value = null
  resetForm()
  dialogVisible.value = true
}

const editExpense = (expense) => {
  editingExpense.value = expense
  Object.assign(expenseForm, {
    category: expense.category_cn || expense.category,
    amount: expense.amount,
    description: expense.description,
    expense_date: expense.expense_date
  })
  dialogVisible.value = true
}

const submitExpense = async () => {
  if (!expenseFormRef.value) return

  await expenseFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const data = {
          ...expenseForm,
          expense_date: formatDateForSubmit(expenseForm.expense_date),
          trip_id: props.tripId
        }

        let res
        if (editingExpense.value) {
          res = await updateExpense(editingExpense.value.id, data)
        } else {
          res = await createExpense(data)
        }

        if (res.status === 0) {
          ElMessage.success(editingExpense.value ? '更新成功' : '添加成功')
          dialogVisible.value = false
          loadExpenses()
        } else {
          ElMessage.error(res.message)
        }
      } catch (error) {
        ElMessage.error('操作失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const deleteExpense = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条支出记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteExpenseApi(id)
    if (res.status === 0) {
      ElMessage.success('删除成功')
      loadExpenses()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const resetForm = () => {
  Object.assign(expenseForm, {
    category: '',
    amount: 0,
    description: '',
    expense_date: ''
  })
  if (expenseFormRef.value) {
    expenseFormRef.value.resetFields()
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatDateForSubmit = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getCategoryType = (category) => {
  const typeMap = {
    '交通': 'primary',
    '住宿': 'success',
    '餐饮': 'warning',
    '门票': 'danger',
    '购物': 'info',
    '其他': ''
  }
  return typeMap[category] || ''
}

watch(() => props.tripId, () => {
  if (props.tripId) {
    loadExpenses()
  }
}, { immediate: true })

onMounted(() => {
  if (props.tripId) {
    loadExpenses()
  }
})
</script>

<style scoped lang="scss">
.budget-manager {
  .budget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
    }
  }

  .budget-overview {
    margin-bottom: 20px;

    .overview-card {
      text-align: center;

      .overview-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 8px;
      }

      .overview-value {
        font-size: 24px;
        font-weight: 600;
        color: #303133;

        &.spent {
          color: #f56c6c;
        }

        &.remaining {
          color: #67c23a;
        }
      }
    }
  }

  .statistics-card {
    margin-bottom: 20px;
  }

  .expense-list-card {
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
