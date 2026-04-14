import { ref, reactive, computed, watch } from 'vue'
import {
    transportModes, weatherIcons, weekMap,
    getDistance, showNotification, getTripDays
} from '@/views/PlanPage/Methods/tripUtils'
import { getLocation, fetchWeatherAndPOI } from '@/views/PlanPage/Methods/apiService'
import { createTrip } from '@/api/trip'
import { useUserStore } from '@/stores/UserStore'
import { trigger } from '@vue/reactivity';

export const useTripPlanning = () => {
    // 步骤状态
    const currentStep = ref(1)
    const totalSteps = 4
    const stepStatus = ref([true, false, false, false])

    // 表单数据
    const tripData = reactive({
        origin: '',
        destination: '',
        startDate: '',
        endDate: '',
        travelers: 1,
        transport: 'driving',
        weather: null,
        pois: [],
        selectedPOIs: [],
        budget: '',
        distance: null
    })

    const forceUpdateDestination = (cityName) => {
        tripData.destination = cityName
        console.log(tripData.destination)
        //trigger(tripData, 'destination');
        //return Promise.resolve()
    }

    // 计算属性
    const distanceInfo = computed(() => {
        if (!tripData.distance) return '距离计算中...'
        return `两地直线距离约 ${tripData.distance.toFixed(1)} 公里`
    })

    const averageTemperature = computed(() => {
        if (tripData.weather && tripData.weather.forecast && tripData.weather.forecast.casts) {
            const casts = tripData.weather.forecast.casts
            let avgTemp = 0
            casts.slice(0, 5).forEach(c => {
                avgTemp += Number(c.daytemp) || 0
            })
            return (avgTemp / Math.min(5, casts.length)).toFixed(1)
        } else {
            return '--'
        }
    })

    const budget = computed(() => estimateBudget())

    // 方法
    const nextStep = () => {
        // 步骤1的验证
        if (currentStep.value === 1) {
            if (!tripData.destination || !tripData.startDate || !tripData.endDate || tripData.travelers < 1) {
                showNotification('请填写完整信息')
                return
            }
            stepStatus.value[1] = true
        }

        if (currentStep.value === 2) {
            stepStatus.value[2] = true
        }

        if (currentStep.value === 3) {
            stepStatus.value[3] = true
        }

        if (currentStep.value < totalSteps) {
            currentStep.value++
        }
    }

    const prevStep = () => {
        if (currentStep.value > 1) {
            currentStep.value--
        }
    }

    const disabledStartDate = (time) => {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
    }

    const disabledEndDate = (time) => {
        if (!tripData.startDate) return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        return time.getTime() < new Date(tripData.startDate).getTime()
    }

    const calculateTime = (mode) => {
        if (!tripData.distance) return '计算中...'

        const speed = transportModes[mode].speed
        const hours = tripData.distance / speed

        if (speed >= 100) {
            return `${hours.toFixed(2)} 小时`
        } else {
            const h = Math.floor(hours)
            const m = Math.round((hours - h) * 60)
            return h > 0 ? `${h}小时${m}分钟` : `${m}分钟`
        }
    }

    const transportText = (mode) => {
        return transportModes[mode]?.name || '未知'
    }

    const togglePOI = (index) => {
        const idx = tripData.selectedPOIs.indexOf(index)
        if (idx > -1) {
            tripData.selectedPOIs.splice(idx, 1)
        } else {
            tripData.selectedPOIs.push(index)
        }
    }

    const restartPlan = () => {
        Object.assign(tripData, {
            origin: '',
            destination: '',
            startDate: '',
            endDate: '',
            travelers: 1,
            transport: 'driving',
            weather: null,
            pois: [],
            selectedPOIs: [],
            budget: '',
            distance: null
        })

        stepStatus.value = [true, false, false, false]
        currentStep.value = 1
    }

    // 地图相关方法
    const showMapStep = async () => {
        const start = tripData.origin || '北京'
        const end = tripData.destination || '上海'

        try {
            const [startLoc, endLoc] = await Promise.all([
                getLocation(start),
                getLocation(end)
            ])

            if (isNaN(startLoc.lng) || isNaN(startLoc.lat) || isNaN(endLoc.lng) || isNaN(endLoc.lat)) {
                throw new Error('获取到无效的坐标数据')
            }

            // 初始化地图逻辑
            if (!window._amap2) {
                window._amap2 = new AMap.Map('map', {
                    zoom: 10,
                    center: [startLoc.lng, startLoc.lat],
                    viewMode: '2D',
                })

                // 添加地图控件
                try {
                    window._amap2.addControl(new AMap.ToolBar({
                        position: 'LT'
                    }))
                    window._amap2.addControl(new AMap.Scale())
                    window._amap2.addControl(new AMap.HawkEye())
                } catch (controlError) {
                    console.warn('地图控件添加失败:', controlError)
                }

                // 添加标记
                try {
                    new AMap.Marker({
                        position: [startLoc.lng, startLoc.lat],
                        map: window._amap2,
                        title: start
                    })
                    new AMap.Marker({
                        position: [endLoc.lng, endLoc.lat],
                        map: window._amap2,
                        title: end
                    })
                } catch (markerError) {
                    console.warn('标记添加失败:', markerError)
                }

                //路线
                try {
                    // 起点和终点坐标
                    const p1 = [startLoc.lng, startLoc.lat]
                    const p2 = [endLoc.lng, endLoc.lat]

                    // 直接用两点数组作为路径
                    new AMap.Polyline({
                        path: [p1, p2],
                        strokeColor: '#0091ff',
                        strokeWeight: 4,
                        isOutline: true,
                        outlineColor: '#fff',
                        lineJoin: 'round',
                        map: window._amap2
                    })
                } catch (polylineError) {
                    console.warn('路线绘制失败:', polylineError)
                }

                //调整地图视野
                try {
                    window._amap2.setFitView()
                } catch (fitViewError) {
                    console.warn('设置地图视图失败:', fitViewError)
                }
            }

            const distance = getDistance(startLoc.lat, startLoc.lng, endLoc.lat, endLoc.lng)
            tripData.distance = distance

        } catch (error) {
            console.error('地图初始化失败:', error)
            showNotification('地图初始化失败，请检查地址是否正确')
        }
    }

    // 获取天气和景点
    const fetchWeatherAndPOIData = async () => {
        const result = await fetchWeatherAndPOI(tripData.destination)
        tripData.weather = result.weather
        tripData.pois = result.pois

        if (!result.weather) {
            showNotification('天气信息获取失败')
        }
        if (result.pois.length === 0) {
            showNotification('未找到相关景点')
        }
    }

    // 预算估算
    const estimateBudget = () => {
        const transportCostMap = { driving: 300, walking: 0, bicycling: 50, airplane: 1200 }
        const transportCost = (transportCostMap[tripData.transport] || 0) * tripData.travelers

        const dailyCost = tripData.budget === 'low' ? 200 : tripData.budget === 'high' ? 800 : 400
        const days = getTripDays(tripData.startDate, tripData.endDate)
        const accommodationCost = dailyCost * days * tripData.travelers

        const ticketCost = (tripData.selectedPOIs.length || 0) * 50 * tripData.travelers

        const total = transportCost + accommodationCost + ticketCost

        return { transportCost, accommodationCost, ticketCost, total, days }
    }

    const formatChineseDate = (date) => {
        if (!date) return '';

        const dateObj = new Date(date);

        if (isNaN(dateObj.getTime())) return '';

        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();

        return `${year}年${month}月${day}日`;
    }


    // PDF导出
    const exportPDF = () => {
        if (!window.jspdf) {
            const script = document.createElement('script')
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
            script.onload = () => doExportPDF()
            document.body.appendChild(script)
        } else {
            doExportPDF()
        }
    }

    const doExportPDF = () => {
        const { jsPDF } = window.jspdf
        const doc = new jsPDF()
        let y = 20

        doc.setFont('helvetica')
        doc.setFontSize(20)
        doc.text('Homfay旅行规划助手 - 行程单', 20, y)
        y += 15

        doc.setFontSize(13)
        doc.text('出发地: ' + (tripData.origin || '--'), 20, y)
        y += 8
        doc.text('目的地: ' + tripData.destination, 20, y)
        y += 8
        doc.text('日期: ' + tripData.startDate + ' 至 ' + tripData.endDate, 20, y)
        y += 8
        doc.text('人数: ' + tripData.travelers + ' 人', 20, y)
        y += 8
        doc.text('交通方式: ' + transportText(tripData.transport), 20, y)
        y += 8
        doc.text('预算: ' + (tripData.budget === 'low' ? '经济型' : tripData.budget === 'high' ? '高端' : '中等'), 20, y)
        y += 12

        doc.setFontSize(15)
        doc.text('预算估算', 20, y)
        y += 8
        doc.setFontSize(12)
        doc.text('交通费用: ¥' + budget.value.transportCost, 20, y)
        y += 7
        doc.text('住宿费用: ¥' + budget.value.accommodationCost, 20, y)
        y += 7
        doc.text('景点门票: ¥' + budget.value.ticketCost, 20, y)
        y += 7
        doc.text('总预算: ¥' + budget.value.total, 20, y)
        y += 12

        doc.setFontSize(15)
        doc.text('推荐景点', 20, y)
        y += 8
        doc.setFontSize(12)
        if (tripData.pois && tripData.selectedPOIs.length > 0) {
            tripData.selectedPOIs.forEach((idx, i) => {
                const poi = tripData.pois[idx]
                doc.text((i + 1) + '. ' + poi.name + ' - ' + (poi.address || ''), 22, y)
                y += 7
            })
        } else {
            doc.text('无', 22, y)
            y += 7
        }

        y += 8
        doc.setFontSize(13)
        doc.text('感谢使用Homfay旅行规划助手！', 20, y)

        doc.save('旅行行程单.pdf')
    }

    const saveTrip = async () => {
        const userStore = useUserStore()

        if (!userStore.id) {
            showNotification('请先登录')
            return { success: false, message: '请先登录' }
        }

        if (!tripData.destination || !tripData.startDate || !tripData.endDate) {
            showNotification('请填写完整信息')
            return { success: false, message: '请填写完整信息' }
        }

        const startDate = new Date(tripData.startDate)
        const year = startDate.getFullYear()
        const month = startDate.getMonth() + 1
        const day = startDate.getDate()
        const tripName = `${tripData.destination}之旅 - ${year}年${month}月${day}日`

        const budgetMap = { low: 2000, medium: 5000, high: 10000 }
        const budgetValue = budgetMap[tripData.budget] || 5000

        try {
            const res = await createTrip({
                user_id: userStore.id,
                trip_name: tripName,
                origin: tripData.origin,
                destination: tripData.destination,
                start_date: tripData.startDate,
                end_date: tripData.endDate,
                travelers: tripData.travelers,
                budget: budgetValue,
                transport: tripData.transport,
                weather_data: tripData.weather,
                pois_data: tripData.pois,
                selected_pois: tripData.selectedPOIs
            })

            if (res.status === 0) {
                showNotification('行程保存成功！')
                return { success: true, data: res.data }
            } else {
                showNotification(res.message || '保存失败')
                return { success: false, message: res.message }
            }
        } catch (error) {
            console.error('保存行程失败:', error)
            showNotification('保存失败，请稍后重试')
            return { success: false, message: '保存失败，请稍后重试' }
        }
    }

    return {
        currentStep,
        totalSteps,
        stepStatus,
        tripData,
        transportModes,
        weatherIcons,
        weekMap,
        distanceInfo,
        averageTemperature,
        budget,
        forceUpdateDestination,
        nextStep,
        prevStep,
        disabledStartDate,
        disabledEndDate,
        calculateTime,
        transportText,
        togglePOI,
        restartPlan,
        showMapStep,
        fetchWeatherAndPOIData,
        formatChineseDate,
        exportPDF,
        saveTrip
    }
}