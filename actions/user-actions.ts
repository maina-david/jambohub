import { Company, Subscription } from '@prisma/client'
import axios from 'axios'

export const getCurrentUserSubscription = (): Promise<Subscription> =>
  axios.get('/api/users/subscription').then((response) => response.data)

export const fetchCompanyDetails = (companyId: string): Promise<Company> =>
  axios.get(`/api/companies/${companyId}`).then((response) => response.data)
