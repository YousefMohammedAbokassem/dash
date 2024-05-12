import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({baseUrl: "http://192.168.1.21:8001/api/"}),
    endpoints: builder => ({
        getTeacher: builder.query({
            query: "/"
        })
    })
})

export const {
    useGetTeacherQuery
} = apiSlice