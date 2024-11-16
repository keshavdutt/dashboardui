import React from 'react'

export default function ChatArea() {
    return (
        <div className="flex-1 flex flex-col min-h-[100vh] rounded-xl bg-muted/50 md:min-h-min p-4">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4">
                <div className="space-y-4">
                    <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                        Hi, how can I help you today?
                    </div>

                    <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-primary text-primary-foreground">
                        Hey, I'm having trouble with my account.
                    </div>

                    <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                        What seems to be the problem?
                    </div>

                    <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-primary text-primary-foreground">
                        I can't log in.
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="mt-4 flex items-center space-x-2">
                <input
                    type="text"
                    className="flex-1 rounded-lg bg-gray-700 text-white px-4 py-2 focus:outline-none"
                    placeholder="Type your message..."
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Send
                </button>
            </div>
        </div>
    )
}
