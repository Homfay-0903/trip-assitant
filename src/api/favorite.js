import instance from "@/http";

export const addFavorite = (data) => {
    const {
        user_id,
        poi_id,
        poi_name,
        poi_address,
        city,
        poi_type
    } = data
    return instance({
        url: '/favorite/add',
        method: 'POST',
        data: {
            user_id,
            poi_id,
            poi_name,
            poi_address,
            city,
            poi_type
        }
    })
}

export const getFavoriteList = (params) => {
    const {
        user_id,
        city
    } = params || {}
    return instance({
        url: '/favorite/list',
        method: 'GET',
        params: {
            user_id,
            city
        }
    })
}

export const deleteFavorite = (id) => {
    return instance({
        url: `/favorite/delete/${id}`,
        method: 'DELETE'
    })
}
