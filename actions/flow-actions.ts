import axios from 'axios'
import { Flow } from "@prisma/client"

export const fetchFlowDetails = (companyId: string, flowId: string): Promise<Flow> =>
  axios.get(`/api/companies/${companyId}/flows/${flowId}`).then((response) => response.data)

export const fetchCompanyFlows = (companyId: string): Promise<Flow[]> =>
  axios.get(`/api/companies/${companyId}/flows`).then((response) => response.data)

