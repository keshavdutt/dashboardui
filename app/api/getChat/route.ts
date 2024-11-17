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
// app/api/getChat/route.ts
import { TogetherAIStream, TogetherAIStreamPayload } from "@/utils/TogetherAIStream";

// Enable edge runtime
// export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  try {
    const { messages } = await req.json();

    // Input validation
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
    };

    // Get the stream from TogetherAIStream
    const stream = await TogetherAIStream(payload);

    // Return the stream with appropriate headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
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