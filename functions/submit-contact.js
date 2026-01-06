/**
 * Cloudflare Pages Function to handle contact form submissions
 * POST /submit-contact
 */
export async function onRequestPost({ request, env }) {
    try {
        const formData = await request.json();
        const { name, email, phone, message, projectType } = formData;

        // 1. Basic Validation
        if (!name || !email || !message) {
            return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 2. Email Dispatch Logic
        console.log(`Received contact from ${name} (${email})`);

        let emailSuccess = false;

        // Check for specific API keys provided by the user (supporting various providers)
        if (env.SENDGRID_API_KEY) {
            // SendGrid Integration
            const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    personalizations: [{ to: [{ email: "info@creativedrywall.buzz" }] }],
                    from: { email: "no-reply@creativedrywall.buzz", name: "Creative Drywall Website" },
                    subject: `New Inquiry from ${name} (${projectType})`,
                    content: [{ type: "text/plain", value: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nType: ${projectType}\n\nMessage:\n${message}` }]
                })
            });
            emailSuccess = response.ok;
            // Resend Integration
            const resendResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Creative Drywall <info@creativedrywall.buzz>', // Using professional domain
                    to: ['info@creativedrywall.buzz'],
                    subject: `New Inquiry from ${name}`,
                    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Type:</strong> ${projectType}</p><p><strong>Message:</strong><br>${message}</p>`
                })
            });

            if (!resendResponse.ok) {
                const errorData = await resendResponse.json();
                console.error("Resend API Error:", JSON.stringify(errorData));
                throw new Error(`Email provider error: ${errorData.message || resendResponse.statusText}`);
            }
            emailSuccess = true;
        } else {
            // No API key found
            console.error("No email API keys configured (SENDGRID_API_KEY or RESEND_API_KEY)");
            throw new Error("Server configuration error: Missing email provider credentials.");
        }

        if (emailSuccess) {
            return new Response(JSON.stringify({
                success: true,
                message: "Thank you! Your message has been received.",
                consultationId: `CD-${Date.now().toString().slice(-6)}`
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            // If we got here, response.ok was false, but we didn't throw yet.
            // (Though strict dispatch normally throws or returns earlier).
            throw new Error("Failed to dispatch email.");
        }

    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
