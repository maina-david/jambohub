import axios from 'axios'

export const fetchDashboardStats = (companyId: string) =>
  axios.get(`/api/companies/${companyId}/dashboard/stats`).then((response) => response.data)
