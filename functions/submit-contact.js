/**
 * Cloudflare Pages Function to handle contact form submissions via Formspark
 * POST /submit-contact
 * 
 * Set the FORMSPARK_FORM_ID environment variable in your Cloudflare Pages dashboard.
 * Get your form ID from: https://formspark.io
 */
export async function onRequestPost({ request, env }) {
    try {
        const formData = await request.json();
        const { name, email, phone, message, projectType, propertyType, timeline, squareFootage, urgency, website } = formData;

        // 1. Honeypot check - if filled, silently reject (bot detected)
        if (website) {
            // Return success to fool the bot, but don't actually submit
            return new Response(JSON.stringify({
                success: true,
                message: "Thank you! Your message has been received."
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 2. Basic Validation
        if (!name || !email || !message) {
            return new Response(JSON.stringify({
                success: false,
                message: "Missing required fields"
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 3. Check for Formspark configuration
        const formId = env.FORMSPARK_FORM_ID;
        if (!formId) {
            console.error("FORMSPARK_FORM_ID environment variable not configured");
            throw new Error("Server configuration error: Missing Formspark form ID.");
        }

        // 4. Submit to Formspark with all fields
        const response = await fetch(`https://submit-form.com/${formId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                phone: phone || 'Not provided',
                projectType: projectType || 'Not specified',
                propertyType: propertyType || 'Not specified',
                timeline: timeline || 'Not specified',
                squareFootage: squareFootage || 'Unknown',
                urgency: urgency || 'Flexible',
                message,
                _subject: `New Inquiry from ${name} - ${urgency === 'emergency' ? '🚨 URGENT' : projectType}`,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Formspark API Error:", errorText);
            throw new Error("Failed to submit form. Please try again.");
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Thank you! Your message has been received.",
            consultationId: `CD-${Date.now().toString().slice(-6)}`
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Form submission error:", error.message);
        return new Response(JSON.stringify({
            success: false,
            message: error.message || "An error occurred. Please try again."
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
