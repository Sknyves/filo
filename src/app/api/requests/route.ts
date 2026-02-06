import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
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
                    status: 'A faire'
                }
            ]);

        if (dbError) {
            console.error("Supabase Error:", dbError);
            throw new Error("Failed to save to database");
        }

        // Gmail Transporter with SSL
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || "smtp.gmail.com",
            port: Number(process.env.EMAIL_PORT) || 465,
            secure: true, // true for port 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Recipients: User who made the request AND the manager
        const recipients = [
            data.email,
            process.env.MANAGER_EMAIL || "ahoussouagee3@gmail.com"
        ].filter(Boolean).join(", ");

        // Send Email
        await transporter.sendMail({
            from: `"RequestFlow" <${process.env.EMAIL_USER}>`,
            to: recipients,
            subject: `Nouvelle Demande: ${data.demandeur}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">Détails de la demande</h2>
                    <p><strong>Demandeur:</strong> ${data.demandeur}</p>
                    <p><strong>Service:</strong> ${data.service}</p>
                    <p><strong>Type:</strong> ${data.type}</p>
                    <p><strong>Description:</strong></p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${data.description}</div>
                    <p style="font-size: 10px; color: #666; margin-top: 30px;">Envoyé via RequestFlow Platform</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true, message: "Request received and email sent" });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
