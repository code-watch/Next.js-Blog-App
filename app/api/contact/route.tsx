import Email from "@/components/main/pages/email";
import { smtpEmail, transporter } from "@/lib/nodemailer";
import { contactFormSchema } from "@/lib/validation/contact";
import { render } from "@react-email/components";
import { NextRequest } from "next/server";
import * as z from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedData = contactFormSchema.parse(body);
    const { name, email, message } = validatedData;

    const emailHtml = await render(
      <Email name={name} email={email} message={message} />,
    );

    const options = {
      from: smtpEmail,
      to: smtpEmail,
      subject: "New Form Submission",
      html: emailHtml,
    };

    // Send email using the transporter
    await transporter.sendMail(options);
    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Contact API Error]", error);
    
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ 
        success: false, 
        errors: error.errors.map(e => ({ field: e.path.join("."), message: e.message }))
      }), { 
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: "Failed to send message" 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
