/**
 * Cloudflare Pages Function: AI Chat Proxy
 * POST /api/chat
 * 
 * Proxies user messages to Google Gemini API while keeping the API key secure.
 */

const SYSTEM_PROMPT = `You are a helpful AI assistant for Creative Drywall, a professional drywall contractor based in Missoula, Montana.

About the Business:
- Services: Drywall installation, repair, texturing, finishing, and commercial/residential projects
- Service Area: Missoula and surrounding areas (Lolo, Florence, Stevensville, Hamilton, Frenchtown, Bonner, Clinton)
- Contact: Available through the website contact form

Your role:
- Answer questions about drywall services, pricing estimates, and project timelines
- Be friendly, professional, and helpful
- If asked about specific pricing, explain that estimates depend on the project and encourage them to use the quote calculator or contact form
- Keep responses concise but informative
- If you don't know something specific about the business, be honest and suggest they contact directly`;

export async function onRequestPost({ request, env }) {
    // CORS headers
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    try {
        // Check for API key
        if (!env.GEMINI_API_KEY) {
            return new Response(JSON.stringify({
                success: false,
                message: "AI service not configured. Please contact the site owner."
            }), { status: 503, headers: corsHeaders });
        }

        let body;
        try {
            body = await request.json();
        } catch (e) {
            return new Response(JSON.stringify({
                success: false,
                message: "Invalid JSON body"
            }), { status: 400, headers: corsHeaders });
        }

        const { message, history = [] } = body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return new Response(JSON.stringify({
                success: false,
                message: "Message is required"
            }), { status: 400, headers: corsHeaders });
        }

        // Build conversation contents for Gemini
        const contents = [];

        // Add conversation history - strictly filter valid messages only
        // Add conversation history - strictly filter valid messages only
        if (Array.isArray(history)) {
            // Take only the last 10 messages to avoid token limits
            const recentHistory = history.slice(-10);

            for (const msg of recentHistory) {
                if (msg.content && typeof msg.content === 'string' && msg.content.trim()) {
                    // Map 'assistant' role to 'model' for Gemini
                    const role = (msg.role === 'assistant' || msg.role === 'model') ? 'model' : 'user';

                    contents.push({
                        role: role,
                        parts: [{ text: msg.content.trim() }]
                    });
                }
            }
        }

        // Add current user message
        contents.push({
            role: 'user',
            parts: [{ text: message.trim() }]
        });

        // Call Gemini API
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    systemInstruction: {
                        parts: [{ text: SYSTEM_PROMPT }]
                    },
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024
                    },
                    safetySettings: [
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
                    ]
                })
            }
        );

        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error("Gemini API error:", JSON.stringify(errorData, null, 2));

            // Map common errors to user-friendly messages
            let userMessage = "AI service temporarily unavailable. Please try again later.";
            if (geminiResponse.status === 400) userMessage = "Invalid request format.";
            if (geminiResponse.status === 403) userMessage = "Access denied (API Key or Region).";
            if (geminiResponse.status === 429) userMessage = "Too many requests. Please slow down.";

            return new Response(JSON.stringify({
                success: false,
                message: userMessage,
                debug: {
                    status: geminiResponse.status,
                    error: errorData.error?.message
                }
            }), { status: 502, headers: corsHeaders });
        }

        const data = await geminiResponse.json();
        const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response. Please try again.";

        return new Response(JSON.stringify({
            success: true,
            message: aiMessage
        }), { status: 200, headers: corsHeaders });

    } catch (error) {
        console.error("Chat API error:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "An unexpected error occurred. Please try again.",
            debug: error.message
        }), { status: 500, headers: corsHeaders });
    }
}

// Handle CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
}
