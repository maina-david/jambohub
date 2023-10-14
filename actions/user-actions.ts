import { Subscription } from '@prisma/client'
import axios from 'axios'

export const getCurrentUserSubscription = (): Promise<Subscription> =>
  axios.get('/api/users/subscription').then((response) => response.data)
