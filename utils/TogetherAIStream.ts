// Import necessary modules from the "eventsource-parser" library
import {
    createParser,
    ParsedEvent,
    ReconnectInterval,
  } from "eventsource-parser";
  
  // Define types for the chat agent roles: user or system
  export type ChatGPTAgent = "user" | "system";
  
  // Define the structure of a chat message
  export interface ChatGPTMessage {
    role: ChatGPTAgent; // Specifies the role (user/system)
    content: string;    // The message content
  }
  
  // Define the payload structure expected by the Together AI API
  export interface TogetherAIStreamPayload {
    model: string;                 // AI model name
    messages: ChatGPTMessage[];    // List of messages in the chat
    stream: boolean;               // Flag to enable streaming
  }
  
  // Function to interact with the Together AI API and process the response as a stream
  export async function TogetherAIStream(payload: TogetherAIStreamPayload) {
    // Initialize encoder/decoder for processing byte streams
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
  
    // Make a POST request to the Together AI API with the provided payload
    const res = await fetch("https://together.helicone.ai/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",                     // Specify JSON content type
        "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`, // Custom authentication header
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY ?? ""}`, // API key for Together AI
      },
      method: "POST",                                           // HTTP POST method
      body: JSON.stringify(payload),                           // Send the payload as a JSON string
    });
  
    // Create a readable stream to process the response incrementally
    const readableStream = new ReadableStream({
      async start(controller) {
        // Callback function to handle each parsed event
        const onParse = (event: ParsedEvent | ReconnectInterval) => {
          if (event.type === "event") {
            const data = event.data; // Extract data from the event
            controller.enqueue(encoder.encode(data)); // Send the data to the stream
          }
        };
  
        // Handle API response errors by checking the status code
        if (res.status !== 200) {
          const errorData = {
            status: res.status,
            statusText: res.statusText,
            body: await res.text(),
          };
          console.error(
            `Error: Received non-200 status code, ${JSON.stringify(errorData)}`
          );
          controller.close(); // Close the stream if an error occurs
          return;
        }
  
        // Initialize the parser to process the streaming response
        const parser = createParser(onParse);
  
        // Read the response body as a stream of chunks
        for await (const chunk of res.body as any) {
          parser.feed(decoder.decode(chunk)); // Feed each chunk into the parser
        }
      },
    });
  
    // Counter to track the number of processed responses
    let counter = 0;
  
    // Create a transform stream to process the parsed chunks into SSE format
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const data = decoder.decode(chunk); // Decode the chunk into a string
        if (data === "[DONE]") {
          controller.terminate(); // Stop processing when the stream is done
          return;
        }
  
        try {
          // Parse the chunk as JSON
          const json = JSON.parse(data);
          // Extract the text content from the response
          const text = json.choices[0].delta?.content || "";
  
          console.log("Incoming streaming data:", text);
  
          // Skip the initial newline prefixes if any
          if (counter < 2 && (text.match(/\n/) || []).length) {
            return;
          }
  
          // Format the response data for SSE
          const payload = { text: text };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`) // Format for SSE
          );
  
          counter++; // Increment the response counter
        } catch (error) {
          // Handle JSON parsing errors
          controller.error(error);
        }
      },
    });
  
    // Pipe the readable stream through the transform stream and return it
    return readableStream.pipeThrough(transformStream);
  }
  