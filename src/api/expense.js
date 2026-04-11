import instance from "@/http";

export const createExpense = (data) => {
    const {
        trip_id,
        category,
        amount,
        description,
        expense_date
    } = data
    return instance({
        url: '/expense/create',
        method: 'POST',
        data: {
            trip_id,
            category,
            amount,
            description,
            expense_date
        }
    })
}

export const getExpenseList = (trip_id, category = null) => {
    return instance({
        url: `/expense/list/${trip_id}`,
        method: 'GET',
        params: {
            category
        }
    })
}

export const getExpenseStatistics = (trip_id) => {
    return instance({
        url: `/expense/statistics/${trip_id}`,
        method: 'GET'
    })
}

export const updateExpense = (id, data) => {
    return instance({
        url: `/expense/update/${id}`,
        method: 'PUT',
        data
    })
}

export const deleteExpense = (id) => {
    return instance({
        url: `/expense/delete/${id}`,
        method: 'DELETE'
    })
}
