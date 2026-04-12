import instance from "@/http";

export const createTravelLog = (data) => {
    const {
        user_id,
        trip_id,
        title,
        content,
        images,
        is_public
    } = data
    return instance({
        url: '/travellog/create',
        method: 'POST',
        data: {
            user_id,
            trip_id,
            title,
            content,
            images,
            is_public
        }
    })
}

export const getTravelLogList = (params) => {
    const {
        page = 1,
        page_size = 10,
        user_id,
        sort = 'latest'
    } = params || {}
    return instance({
        url: '/travellog/list',
        method: 'GET',
        params: {
            page,
            page_size,
            user_id,
            sort
        }
    })
}

export const getTravelLogDetail = (id) => {
    return instance({
        url: `/travellog/detail/${id}`,
        method: 'GET'
    })
}

export const likeTravelLog = (id) => {
    return instance({
        url: `/travellog/like/${id}`,
        method: 'POST'
    })
}

export const deleteTravelLog = (id) => {
    return instance({
        url: `/travellog/delete/${id}`,
        method: 'DELETE'
    })
}
