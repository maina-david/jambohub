import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const SendText = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('application/reactflow', 'custom');
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div
            className="grid gap-4"
            draggable
            onDragStart={(event) => onDragStart(event)}
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="maxlength">Send Text</Label>
            </div>
            <div>
              <Textarea
                placeholder="Type the text to be sent..."
                rows={4}
                className="w-full rounded border p-2"
              ></Textarea>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-[260px] text-sm" side="left">
          The reply message to be sent when a customer&apos;s message is received by our APIs
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default SendText;
