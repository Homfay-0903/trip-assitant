import instance from "@/http";

export const createReminder = (data) => {
    const {
        user_id,
        trip_id,
        reminder_type,
        reminder_time,
        content
    } = data
    return instance({
        url: '/reminder/create',
        method: 'POST',
        data: {
            user_id,
            trip_id,
            reminder_type,
            reminder_time,
            content
        }
    })
}

export const getReminderList = (params) => {
    const {
        user_id,
        is_sent
    } = params || {}
    return instance({
        url: '/reminder/list',
        method: 'GET',
        params: {
            user_id,
            is_sent
        }
    })
}

export const updateReminder = (id, data) => {
    const {
        reminder_type,
        reminder_time,
        content,
        is_sent
    } = data
    return instance({
        url: `/reminder/update/${id}`,
        method: 'PUT',
        data: {
            reminder_type,
            reminder_time,
            content,
            is_sent
        }
    })
}

export const deleteReminder = (id) => {
    return instance({
        url: `/reminder/delete/${id}`,
        method: 'DELETE'
    })
}
