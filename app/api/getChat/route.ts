// Import necessary utilities for streaming with Together AI
import {
    TogetherAIStream,
    TogetherAIStreamPayload,
  } from "@/utils/TogetherAIStream";
  
  // Define the maximum allowed duration for the process
  export const maxDuration = 60;
  
  // POST endpoint handler to process incoming requests
  export async function POST(request: Request): Promise<Response> {
    // Parse the incoming JSON payload from the request
    let { messages }: { messages: TogetherAIStreamPayload["messages"] } = 
      await request.json();
    
    console.log("[POST] Request received with messages:", messages);
  
    try {
      // Log that the Together API stream request is being initiated
      console.log("[POST] Fetching answer stream from Together API");
  
      // Construct the payload to send to Together AI
      const payload: TogetherAIStreamPayload = {
        model: "meta-llama/Llama-Vision-Free", // Specify the AI model to use
        messages,                             // Pass chat messages
        stream: true,                         // Enable streaming response
      };
  
      console.log("[POST] Payload constructed:", payload);
  
      // Fetch the streaming response from Together AI
      const stream = await TogetherAIStream(payload);
  
      // Return the stream response to the client
      return new Response(stream, {
        headers: new Headers({
          "Cache-Control": "no-cache", // Disable caching for real-time updates
        }),
      });
    } catch (error) {
      // Log the error for debugging
      console.error("[POST] Error fetching answer stream:", error);
  
      // Return a failure response with a custom status
      return new Response("Error: Answer stream failed.", { status: 202 });
    }
  }
  