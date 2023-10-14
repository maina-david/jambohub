import { Team } from '@prisma/client'
import axios from 'axios'

export const fetchTeams = (companyId: string): Promise<Team[]> =>
  axios.get(`/api/companies/${companyId}/teams`).then((response) => response.data)

