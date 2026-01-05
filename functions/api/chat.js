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

        const { message, history = [] } = await request.json();

        if (!message || typeof message !== 'string') {
            return new Response(JSON.stringify({
                success: false,
                message: "Message is required"
            }), { status: 400, headers: corsHeaders });
        }

        // Build conversation contents for Gemini
        const contents = [];

        // Add conversation history
        for (const msg of history) {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        }

        // Add current user message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        // Call Gemini API
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
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
            console.error("Gemini API error:", errorData);
            return new Response(JSON.stringify({
                success: false,
                message: "AI service temporarily unavailable. Please try again later."
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
            message: "An unexpected error occurred. Please try again."
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
