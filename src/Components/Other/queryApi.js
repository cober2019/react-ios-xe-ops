import { useQuery } from 'react-query'
const { isLoading, error, data, isFetching } = queryForApiData(localStorage.getItem('ip'), 'indexData', localStorage.getItem('username'), 
443, passwordDecrypt.toString(enc.Utf8), '/pollIndexPage')
export const queryForApiData = (ip, todo, username, port, decyptPassword, uri) => {

    const query = useQuery(ip + todo, async () => {await axios.post(uri, {'ip': ip, 'username': username,  'password': decyptPassword, 'port': port})

    return data.data

    },
    {refetchInterval: 10000}
                    )
    return query
}
