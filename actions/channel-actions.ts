import { Channel } from '@prisma/client'
import axios from 'axios'

export const fetchChannels = (companyId: string): Promise<Channel[]> =>
  axios.get(`/api/companies/${companyId}/channels`).then((response) => response.data)


