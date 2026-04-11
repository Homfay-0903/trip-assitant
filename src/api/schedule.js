import instance from "@/http";

export const createSchedule = (data) => {
    const {
        trip_id,
        day_number,
        date,
        morning_activity,
        afternoon_activity,
        evening_activity,
        notes
    } = data
    return instance({
        url: '/schedule/create',
        method: 'POST',
        data: {
            trip_id,
            day_number,
            date,
            morning_activity,
            afternoon_activity,
            evening_activity,
            notes
        }
    })
}

export const getScheduleList = (trip_id) => {
    return instance({
        url: `/schedule/list/${trip_id}`,
        method: 'GET'
    })
}

export const updateSchedule = (id, data) => {
    return instance({
        url: `/schedule/update/${id}`,
        method: 'PUT',
        data
    })
}

export const deleteSchedule = (id) => {
    return instance({
        url: `/schedule/delete/${id}`,
        method: 'DELETE'
    })
}
