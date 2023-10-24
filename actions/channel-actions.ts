import { ChannelProps } from '@/types/channel'
import axios from 'axios'

export const fetchChannels = (companyId: string): Promise<ChannelProps[]> =>
  axios.get(`/api/companies/${companyId}/channels`).then((response) => response.data)
