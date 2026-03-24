import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Save to Supabase
        const { error: dbError } = await supabase
            .from('requests')
            .insert([
                {
                    demandeur: data.demandeur,
                    email: data.email,
                    service: data.service,
                    type: data.type,
                    description: data.description,
                    file_urls: data.file_urls,
                    status: 'A faire'
                }
            ]);

        if (dbError) {
            console.error("Supabase Error:", dbError);
            throw new Error("Failed to save to database");
        }

        // Recipients: User who made the request AND the manager
        const recipients = [
            data.email,
            process.env.MANAGER_EMAIL || "ahoussouagee3@gmail.com"
        ].filter(Boolean);

        // Send Email via Mailzeet
        const mailzeetResponse = await fetch("https://api.mailzeet.com/v1/mails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.MAILZEET_API_KEY}`
            },
            body: JSON.stringify({
                sender: {
                    name: "RequestFlow",
                    email: "no-reply@mailzeet.com"
                },
                recipients: recipients.map(r => ({ email: r })),
                subject: `Nouvelle Demande: ${data.demandeur}`,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <body>
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                        <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">Détails de la demande</h2>
                        <p><strong>Demandeur:</strong> ${data.demandeur}</p>
                        <p><strong>Service:</strong> ${data.service}</p>
                        <p><strong>Type:</strong> ${data.type}</p>
                        <p><strong>Description:</strong></p>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">${data.description}</div>
                        
                        ${data.file_urls && data.file_urls.length > 0 ? `
                            <p><strong>Documents joints:</strong></p>
                            <ul style="list-style: none; padding: 0;">
                                ${(() => {
                                    let urls = [];
                                    if (Array.isArray(data.file_urls)) {
                                        urls = data.file_urls;
                                    } else if (typeof data.file_urls === 'string' && data.file_urls.trim() !== '') {
                                        try { urls = JSON.parse(data.file_urls); if (!Array.isArray(urls)) urls = [data.file_urls]; } 
                                        catch (e) { urls = [data.file_urls]; }
                                    }
                                    return urls.map((url: string, i: number) => `
                                        <li style="margin-bottom: 8px;">
                                            <a href="${url}" style="color: #6366f1; text-decoration: none; font-weight: bold; font-size: 14px;">
                                                📎 Document joint #${i + 1}
                                            </a>
                                        </li>
                                    `).join('');
                                })()}
                            </ul>
                        ` : ''}
                        
                        <p style="font-size: 10px; color: #666; margin-top: 30px;">Envoyé via RequestFlow Platform</p>
                    </div>
                    </body>
                    </html>
                `,
            }),
        });

        if (!mailzeetResponse.ok) {
            const errorText = await mailzeetResponse.text();
            console.error("Mailzeet Error:", errorText);
            // Optionally throw error based on requirements, but here we'll just log
        }

        return NextResponse.json({ success: true, message: "Request received and email sent" });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
