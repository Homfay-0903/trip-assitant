import instance from "@/http";

export const createTrip = (data) => {
    const {
        user_id,
        trip_name,
        origin,
        destination,
        start_date,
        end_date,
        travelers,
        budget,
        transport
    } = data
    return instance({
        url: '/trip/create',
        method: 'POST',
        data: {
            user_id,
            trip_name,
            origin,
            destination,
            start_date,
            end_date,
            travelers,
            budget,
            transport
        }
    })
}

export const getTripList = (params) => {
    const {
        user_id,
        page = 1,
        page_size = 10,
        status
    } = params || {}
    return instance({
        url: '/trip/list',
        method: 'GET',
        params: {
            user_id,
            page,
            page_size,
            status
        }
    })
}

export const getTripDetail = (id) => {
    return instance({
        url: `/trip/detail/${id}`,
        method: 'GET'
    })
}

export const updateTrip = (id, data) => {
    return instance({
        url: `/trip/update/${id}`,
        method: 'PUT',
        data
    })
}

export const deleteTrip = (id) => {
    return instance({
        url: `/trip/delete/${id}`,
        method: 'DELETE'
    })
}

export const shareTrip = (trip_id) => {
    return instance({
        url: '/trip/share',
        method: 'POST',
        data: {
            trip_id
        }
    })
}
