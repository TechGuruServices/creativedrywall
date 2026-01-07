/**
 * Creative Drywall AI Assistant - Cloudflare Workers AI
 * Montana's Family-Owned Drywall Company Since 1976
 * 
 * Uses Workers AI Bindings with @cf/meta/llama-3-8b-instruct
 */

export interface Env {
    AI: Ai;
}

// Business Constants
const BUSINESS_INFO = {
    name: "Creative Drywall",
    phone: "(406) 239-0850",
    email: "info@creativedrywall.buzz",
    address: "6785 Prairie Schooner Lane, Missoula, MT 59808",
    heritage: "49+ years of family expertise and 4 generations of craftsmanship",
    guarantee: "100% satisfaction guarantee",
    yearFounded: 1976
} as const;

const MONTANA_SERVICE_AREAS = [
    "missoula", "lolo", "florence", "stevensville", "hamilton",
    "frenchtown", "bonner", "clinton", "seeley lake", "drummond",
    "philipsburg", "deer lodge", "anaconda", "butte", "helena",
    "great falls", "kalispell", "whitefish", "polson", "ronan",
    "bozeman", "livingston", "billings", "miles city", "montana"
];

const NON_MONTANA_INDICATORS = [
    "california", "texas", "new york", "florida", "washington",
    "oregon", "idaho", "wyoming", "colorado", "utah", "arizona",
    "nevada", "canada", "overseas", "international"
];

// Safety Patterns
const INJECTION_PATTERNS = [
    /ignore\s+(previous|all|above)\s+instructions?/i,
    /forget\s+(everything|all|your)\s+(instructions?|rules?|training)/i,
    /you\s+are\s+now\s+a?\s*(different|new|evil|harmful)/i,
    /pretend\s+(you\s+are|to\s+be)/i,
    /system\s*:?\s*prompt/i,
    /jailbreak/i,
    /DAN\s+mode/i,
    /override\s+(safety|rules|restrictions)/i
];

const PRICE_PATTERNS = [
    /\$\d+/,
    /\d+\s*dollars?/i,
    /cost[s]?\s*(is|are|about|around)?\s*\d+/i,
    /price[s]?\s*(is|are|about|around)?\s*\d+/i
];

// System Prompt
const SYSTEM_PROMPT = `You are the AI assistant for Creative Drywall, Montana's premier family-owned drywall company since 1976. The Thompson family has provided exceptional drywall services for 49+ years across 4 generations.

CRITICAL RULES (NEVER VIOLATE):

1. PRICING: NEVER quote specific prices or dollar amounts. ALWAYS say: "The Thompson family provides free, no-obligation quotes. Call ${BUSINESS_INFO.phone} to discuss your specific project."

2. SERVICE AREA: ONLY serve Montana clients. If asked about other states, politely explain you only serve Montana.

3. CONTACT: Always include:
   - Phone: ${BUSINESS_INFO.phone}
   - Email: ${BUSINESS_INFO.email}
   - Address: ${BUSINESS_INFO.address}

4. HERITAGE: Reference "${BUSINESS_INFO.heritage}" when discussing experience.

5. GUARANTEE: Mention "${BUSINESS_INFO.guarantee}" in service discussions.

6. EMERGENCIES: Say: "We understand this is urgent. The Thompson family will assess your situation today. Please call ${BUSINESS_INFO.phone} immediately."

Services: Drywall installation, repair, texturing, finishing, commercial/residential.
Be warm, professional, and drive inquiries toward consultation calls.`;

// CORS Headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
};

// Input Sanitization
function sanitizeInput(input: string): { safe: boolean; sanitized: string; reason?: string } {
    if (!input || typeof input !== "string") {
        return { safe: false, sanitized: "", reason: "Invalid input" };
    }
    const trimmed = input.trim();
    if (trimmed.length === 0 || trimmed.length > 2000) {
        return { safe: false, sanitized: "", reason: trimmed.length === 0 ? "Empty message" : "Message too long" };
    }
    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(trimmed)) {
            return { safe: false, sanitized: "", reason: "Invalid request format" };
        }
    }
    return { safe: true, sanitized: trimmed.replace(/<[^>]+>/g, "") };
}

// Response Validation
function validateResponse(response: string): string {
    let filtered = response;
    for (const pattern of PRICE_PATTERNS) {
        if (pattern.test(filtered)) {
            filtered = filtered.replace(pattern, `[Contact ${BUSINESS_INFO.phone} for pricing]`);
        }
    }
    return filtered;
}

// Helper checks
function isEmergency(msg: string): boolean {
    return /emergency|urgent|asap|water\s*damage|flooding|today|immediately/i.test(msg);
}

function isPricingQuestion(msg: string): boolean {
    return /how\s+much|cost|price|pricing|estimate|quote|rate|charge|\d+\s*x\s*\d+/i.test(msg);
}

function isLocationQuery(msg: string): boolean {
    return /do\s+you\s+(serve|service|cover)|service\s+area|where\s+are\s+you/i.test(msg);
}

function isNonMontana(msg: string): boolean {
    const lower = msg.toLowerCase();
    return NON_MONTANA_INDICATORS.some(loc => lower.includes(loc));
}

function isOffTopic(msg: string): boolean {
    return /hack|illegal|politic|election|dating|gambling|weapon/i.test(msg);
}

function getFallback(): string {
    return `I'm having trouble right now. Please contact us directly:

📞 **${BUSINESS_INFO.phone}**
📧 ${BUSINESS_INFO.email}
📍 ${BUSINESS_INFO.address}

${BUSINESS_INFO.heritage} - we're here to help!`;
}

// Main Handler
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }
        if (request.method !== "POST") {
            return new Response(JSON.stringify({ success: false, message: "Method not allowed" }),
                { status: 405, headers: corsHeaders });
        }

        try {
            let body: { message?: string; history?: Array<{ role: string; content: string }> };
            try {
                body = await request.json();
            } catch {
                return new Response(JSON.stringify({ success: false, message: "Invalid JSON" }),
                    { status: 400, headers: corsHeaders });
            }

            const { message, history = [] } = body;
            const sanitizeResult = sanitizeInput(message || "");
            if (!sanitizeResult.safe) {
                return new Response(JSON.stringify({ success: false, message: sanitizeResult.reason }),
                    { status: 400, headers: corsHeaders });
            }

            const userMessage = sanitizeResult.sanitized;

            // Off-topic redirect
            if (isOffTopic(userMessage)) {
                return new Response(JSON.stringify({
                    success: true,
                    message: `I'm here for drywall questions! ${BUSINESS_INFO.heritage}. How can I help with your project? 📞 ${BUSINESS_INFO.phone}`
                }), { status: 200, headers: corsHeaders });
            }

            // Location queries - non-Montana
            if (isLocationQuery(userMessage) && isNonMontana(userMessage)) {
                return new Response(JSON.stringify({
                    success: true,
                    message: `Thank you for your interest! Unfortunately, we only serve Montana, primarily Missoula and surrounding valleys.

If you're in Montana, we'd love to help! ${BUSINESS_INFO.heritage}.

📞 ${BUSINESS_INFO.phone}
📧 ${BUSINESS_INFO.email}`
                }), { status: 200, headers: corsHeaders });
            }

            // Pricing questions - direct deflection
            if (isPricingQuestion(userMessage)) {
                return new Response(JSON.stringify({
                    success: true,
                    message: `Every project is unique! The Thompson family provides **free, no-obligation quotes** tailored to your needs.

${BUSINESS_INFO.heritage} with our ${BUSINESS_INFO.guarantee}.

📞 Call: ${BUSINESS_INFO.phone}
📧 Email: ${BUSINESS_INFO.email}
📍 ${BUSINESS_INFO.address}`
                }), { status: 200, headers: corsHeaders });
            }

            // Emergencies
            if (isEmergency(userMessage)) {
                return new Response(JSON.stringify({
                    success: true,
                    message: `**We understand this is urgent.** The Thompson family will assess your situation today.

🚨 **Call ${BUSINESS_INFO.phone} immediately.**

${BUSINESS_INFO.heritage} - we've handled countless emergencies.`
                }), { status: 200, headers: corsHeaders });
            }

            // Build AI messages
            const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
                { role: "system", content: SYSTEM_PROMPT }
            ];
            for (const msg of history.slice(-6)) {
                if (msg.content?.trim()) {
                    messages.push({
                        role: msg.role === "assistant" ? "assistant" : "user",
                        content: msg.content.trim()
                    });
                }
            }
            messages.push({ role: "user", content: userMessage });

            // Call Workers AI
            let aiResponse: string;
            try {
                const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
                    messages,
                    max_tokens: 512,
                    temperature: 0.7
                });
                aiResponse = (response as { response: string }).response || "";
                if (!aiResponse.trim()) throw new Error("Empty response");
            } catch {
                return new Response(JSON.stringify({ success: true, message: getFallback() }),
                    { status: 200, headers: corsHeaders });
            }

            return new Response(JSON.stringify({
                success: true,
                message: validateResponse(aiResponse)
            }), { status: 200, headers: corsHeaders });

        } catch {
            return new Response(JSON.stringify({ success: true, message: getFallback() }),
                { status: 200, headers: corsHeaders });
        }
    }
};
