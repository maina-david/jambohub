import { Channel, ChannelToFlow } from "@prisma/client";

export enum ChannelType {
  WHATSAPP = 'WHATSAPP',
  TWITTER = 'TWITTER',
  FACEBOOK = 'FACEBOOK',
  SMS = 'SMS',
}

export interface ChannelProps extends Channel {
  ChannelToFlow?: ChannelToFlow
}
