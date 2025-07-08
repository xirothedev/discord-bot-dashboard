"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogContent } from "@/types/log";
import { Bot, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export function LogEntry({ log }: { log: LogContent }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-transparent"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Bot className="h-3 w-3" />
                <span>{log.botName}</span>
              </div>
            </div>

            <div className="text-sm font-medium mb-1">{log.content}</div>

            {/* {isExpanded && (
              <div className="mt-3 space-y-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
                {log.details && (
                  <div>
                    <span className="font-medium">Details:</span>
                    <pre className="mt-1 p-2 bg-muted/50 rounded text-xs overflow-x-auto">
                      {log.details}
                    </pre>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Log ID:</span> {log.id}
                  </div>
                  <div>
                    <span className="font-medium">Bot ID:</span> {log.botId}
                  </div>
                  {log.userId && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="font-medium">User:</span> {log.userId}
                    </div>
                  )}
                  {log.channelId && (
                    <div className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      <span className="font-medium">Channel:</span>{" "}
                      {log.channelId}
                    </div>
                  )}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
