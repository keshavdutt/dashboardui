// // Import necessary utilities for streaming with Together AI

// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-nocheck


// import {
//     TogetherAIStream,
//     TogetherAIStreamPayload,
//   } from "@/utils/TogetherAIStream";
  
//   // Configure for edge runtime
//   export const runtime = 'edge';
  
//   // Remove maxDuration as it's not needed for edge functions
//   // export const maxDuration = 60;
  
//   // Modify the handler to work with edge runtime
//   export async function POST(request: Request): Promise<Response> {
//     try {
//       const { messages }: { messages: TogetherAIStreamPayload["messages"] } = 
//         await request.json();
      
//       console.log("[POST] Request received with messages:", messages);
  
//       const payload: TogetherAIStreamPayload = {
//         model: "meta-llama/Llama-Vision-Free",
//         messages,
//         stream: true,
//         max_tokens: 2000, // Add a reasonable limit
//         temperature: 0.7, // Add temperature for consistent behavior
//       };
  
//       console.log("[POST] Payload constructed:", payload);
  
//       const stream = await TogetherAIStream(payload);
  
//       // Set up proper headers for streaming in Vercel
//       return new Response(stream, {
//         headers: {
//           'Content-Type': 'text/event-stream',
//           'Cache-Control': 'no-cache, no-transform',
//           'Connection': 'keep-alive',
//           'X-Content-Type-Options': 'nosniff',
//           'Content-Encoding': 'none',
//           'Transfer-Encoding': 'chunked'
//         },
//       });
//     } catch (error) {
//       console.error("[POST] Error in stream processing:", error);
      
//       // Return a more detailed error response
//       return new Response(
//         JSON.stringify({
//           error: "Stream processing failed",
//           details: error instanceof Error ? error.message : "Unknown error"
//         }), {
//           status: 500,
//           headers: {
//             'Content-Type': 'application/json',
//           },
//       });
//     }
//   }


// Import necessary utilities for streaming with Together AI

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import {
    TogetherAIStream,
    TogetherAIStreamPayload,
  } from "@/utils/TogetherAIStream";
  
  export const runtime = 'edge';
  
  const encoder = new TextEncoder();
  
  function createStream(data: ReadableStream): ReadableStream {
    const textEncoder = new TextEncoder();
  
    return new ReadableStream({
      async start(controller) {
        try {
          const reader = data.getReader();
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            
            // Ensure the value is encoded properly
            const chunk = typeof value === 'string' 
              ? textEncoder.encode(`data: ${value}\n\n`)
              : value;
              
            controller.enqueue(chunk);
          }
        } catch (error) {
          console.error('Stream processing error:', error);
          controller.error(error);
        }
      },
    });
  }
  
  export async function POST(req: Request): Promise<Response> {
    try {
      const { messages } = await req.json();
  
      // Validate input
      if (!messages || !Array.isArray(messages)) {
        return new Response(
          JSON.stringify({ error: 'Invalid messages format' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      const payload: TogetherAIStreamPayload = {
        model: "meta-llama/Llama-Vision-Free",
        messages,
        stream: true,
        max_tokens: 2000,
        temperature: 0.7,
      };
  
      // Get the base stream
      const baseStream = await TogetherAIStream(payload);
      
      // Create the enhanced stream
      const processedStream = createStream(baseStream);
  
      // Return the response with appropriate headers
      return new Response(processedStream, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Content-Type-Options': 'nosniff',
          'Transfer-Encoding': 'chunked',
        },
      });
  
    } catch (error) {
      console.error('API Error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Internal Server Error', 
          message: error instanceof Error ? error.message : 'Unknown error'
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  }
  
  // Enable CORS
  export async function OPTIONS(request: Request) {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }