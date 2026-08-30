// import { NextRequest, NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// export async function POST(request) {
//   const data = await request.json();
//   const { email, message } = data;

//   if (!email || !message) {
//     return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//    await transporter.sendMail({
//   replyTo: email,  
//   to: process.env.EMAIL_USER,   
//   subject: `New Suggestion from ${email}`,
               
//    html: `
//     <p><strong>From:</strong> ${email}</p>
//     <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br/>')}</p>
//   `,
// });


//     return NextResponse.json({ success: true, message: 'Email sent successfully.' }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   } 
// }

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  const data = await request.json();
  const { email, message } = data;
console.log(email)
  if (!email || !message) {
    return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    
    await transporter.sendMail({
      from: email, 
  to: process.env.EMAIL_USER,
      subject: `New Suggestion from ${email}`,
      replyTo: email,
      html: `
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    
    await transporter.sendMail({
  from: `"Sarkitshala Team" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: 'Thank You for Your Suggestion!',
  html: `
    <h1><mark>Hey Reviewer,</mark></h1>
    <p>Thank you for reviewing Sarkitshala.com and sharing your suggestions. Your feedback is important to us and will be carefully considered by our team.</p>
    <strong>note:</strong><p>This is an auto-generated email. Please do not reply to this message.</p>
    
            
    <p>Warm regards,<br/>Team Sarkitshala</p>
  `,
});


    return NextResponse.json({ success: true, message: 'Emails sent successfully.' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
