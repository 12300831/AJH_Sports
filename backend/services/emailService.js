/**
 * Email Service
 * Handles sending booking confirmation emails using Gmail SMTP (FREE)
 */

import nodemailer from 'nodemailer';

// Create Gmail transporter (fail-safe - returns null if not configured)
let transporter = null;

try {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  // Only create transporter if credentials are provided
  if (emailUser && emailPass) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass // Gmail App Password
      }
    });

    console.log('[Email] ✅ Gmail SMTP transporter configured');
  } else {
    console.warn('[Email] ⚠️  EMAIL_USER or EMAIL_PASS not set - emails will be logged only');
  }
} catch (error) {
  console.error('[Email] ❌ Error creating email transporter:', error.message);
  console.warn('[Email] ⚠️  Emails will be logged only until credentials are configured');
}

/**
 * Send booking confirmation email
 * @param {Object} bookingDetails - Booking details with user and event/coach info
 * @param {Object} eventOrCoach - Event or Coach object
 * @param {string} bookingType - 'event' or 'coach'
 */
export const sendBookingConfirmationEmail = async (bookingDetails, eventOrCoach, bookingType) => {
  try {
    const userEmail = bookingDetails.user_email || bookingDetails.email;
    const userName = bookingDetails.user_name || bookingDetails.name || 'Valued Customer';

    if (!userEmail) {
      console.warn('[Email] No email address found for booking confirmation');
      return false;
    }

    // Build email content based on booking type
    let subject = '';
    let emailBody = '';

    if (bookingType === 'event') {
      const event = eventOrCoach;
      
      // Format date and time properly with fallbacks
      let eventDateFormatted = 'TBA';
      if (event.date && event.time) {
        try {
          // Handle different date/time formats from MySQL
          // Date could be: "2025-01-22" or Date object
          // Time could be: "10:00:00", "10:00", or Time object
          const dateStr = event.date instanceof Date 
            ? event.date.toISOString().split('T')[0] 
            : String(event.date).trim();
          
          const timeStr = event.time instanceof Date 
            ? event.time.toTimeString().split(' ')[0] 
            : String(event.time).trim();
          
          // Remove seconds if present (HH:MM:SS -> HH:MM)
          const timeWithoutSeconds = timeStr.split(':').slice(0, 2).join(':');
          
          // Combine date and time
          const dateTimeStr = `${dateStr}T${timeWithoutSeconds}:00`;
          const dateObj = new Date(dateTimeStr);
          
          // Check if date is valid
          if (!isNaN(dateObj.getTime())) {
            eventDateFormatted = dateObj.toLocaleString('en-AU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Australia/Sydney'
            });
          } else {
            // Fallback: try to format date and time separately
            if (dateStr && timeWithoutSeconds) {
              const dateOnly = new Date(dateStr);
              if (!isNaN(dateOnly.getTime())) {
                const formattedDate = dateOnly.toLocaleDateString('en-AU', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                eventDateFormatted = `${formattedDate} at ${timeWithoutSeconds}`;
              }
            }
          }
        } catch (error) {
          console.error('[Email] Error formatting event date/time:', error);
          // Fallback: show raw values if formatting fails
          if (event.date && event.time) {
            eventDateFormatted = `${event.date} at ${event.time}`;
          }
        }
      } else if (event.date) {
        // Only date available, format it
        try {
          const dateStr = event.date instanceof Date 
            ? event.date.toISOString().split('T')[0] 
            : String(event.date).trim();
          const dateObj = new Date(dateStr);
          if (!isNaN(dateObj.getTime())) {
            eventDateFormatted = dateObj.toLocaleDateString('en-AU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        } catch (error) {
          eventDateFormatted = String(event.date);
        }
      }

      subject = `Booking Confirmation: ${event.name || 'Event'}`;
      
      emailBody = `
Dear ${userName},

Thank you for your booking! Your registration has been confirmed.

BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Event: ${event.name || 'Event'}
Date & Time: ${eventDateFormatted}
Location: ${event.location || 'TBA'}
Price: $${event.price ? parseFloat(event.price).toFixed(2) : '0.00'} AUD
Booking ID: #${bookingDetails.id}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${event.description ? `\nDescription:\n${event.description}\n` : ''}

IMPORTANT INFORMATION:
• Please arrive 15 minutes before the event start time
• Bring appropriate sports equipment if required
• If you need to cancel, please contact us at least 24 hours in advance

📅 SESSION AVAILABILITY:
For session availability, AJH Sports will contact you soon to confirm your preferred dates and times.

We look forward to seeing you!

Best regards,
AJH Sports Team
ajh@ajhsports.com.au
      `.trim();

    } else if (bookingType === 'coach') {
      const coach = eventOrCoach;
      // Handle both date/booking_date and time/booking_time field names
      const date = bookingDetails.booking_date || bookingDetails.date;
      const time = bookingDetails.booking_time || bookingDetails.time;
      
      // Format date and time properly with fallbacks (same as event booking)
      let bookingDateFormatted = 'TBA';
      if (date && time) {
        try {
          const dateStr = date instanceof Date 
            ? date.toISOString().split('T')[0] 
            : String(date).trim();
          
          const timeStr = time instanceof Date 
            ? time.toTimeString().split(' ')[0] 
            : String(time).trim();
          
          const timeWithoutSeconds = timeStr.split(':').slice(0, 2).join(':');
          const dateTimeStr = `${dateStr}T${timeWithoutSeconds}:00`;
          const dateObj = new Date(dateTimeStr);
          
          if (!isNaN(dateObj.getTime())) {
            bookingDateFormatted = dateObj.toLocaleString('en-AU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Australia/Sydney'
            });
          } else {
            if (dateStr && timeWithoutSeconds) {
              const dateOnly = new Date(dateStr);
              if (!isNaN(dateOnly.getTime())) {
                const formattedDate = dateOnly.toLocaleDateString('en-AU', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                bookingDateFormatted = `${formattedDate} at ${timeWithoutSeconds}`;
              }
            }
          }
        } catch (error) {
          console.error('[Email] Error formatting coach booking date/time:', error);
          if (date && time) {
            bookingDateFormatted = `${date} at ${time}`;
          }
        }
      } else if (date) {
        try {
          const dateStr = date instanceof Date 
            ? date.toISOString().split('T')[0] 
            : String(date).trim();
          const dateObj = new Date(dateStr);
          if (!isNaN(dateObj.getTime())) {
            bookingDateFormatted = dateObj.toLocaleDateString('en-AU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        } catch (error) {
          bookingDateFormatted = String(date);
        }
      }

      // Use current coach info from database (passed from webhook)
      const duration = bookingDetails.duration || 60;
      const hourlyRate = parseFloat(coach.hourly_rate) || 0;
      const totalPrice = (hourlyRate * duration / 60).toFixed(2);
      
      subject = `Coaching Session Confirmation with ${coach.name || 'Coach'}`;
      
      emailBody = `
Dear ${userName},

Thank you for booking a coaching session! Your booking has been confirmed.

BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Coach: ${coach.name || 'Coach'}
Specialty: ${coach.specialty || 'General Coaching'}
${coach.location ? `Location: ${coach.location}\n` : ''}Date & Time: ${bookingDateFormatted}
Duration: ${duration} minutes
Price: $${totalPrice} AUD
Booking ID: #${bookingDetails.id}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${bookingDetails.notes ? `\nNotes:\n${bookingDetails.notes}\n` : ''}

IMPORTANT INFORMATION:
• Please arrive 5 minutes before your scheduled time
• Bring appropriate equipment for your session
• If you need to reschedule or cancel, please contact us at least 24 hours in advance
${coach.location ? `• Location: ${coach.location}\n` : ''}
We look forward to working with you!

Best regards,
AJH Sports Team
ajh@ajhsports.com.au
      `.trim();

    } else if (bookingType === 'lesson') {
      const lesson = eventOrCoach;
      const bookingTypeStr = bookingDetails.booking_type === 'pack' ? '10 Session Pack' : 'Single Session';
      
      subject = `Lesson Booking Confirmation: ${lesson.title || 'Group Coaching Lesson'}`;
      
      emailBody = `
Dear ${userName},

Thank you for booking a group coaching lesson! Your booking has been confirmed.

BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lesson: ${lesson.title || 'Group Coaching Lesson'}
Category: ${lesson.category || 'General'}
Booking Type: ${bookingTypeStr}
${bookingDetails.sessions_remaining !== null && bookingDetails.booking_type === 'pack' 
  ? `Sessions Remaining: ${bookingDetails.sessions_remaining}\n` 
  : ''}Booking ID: #${bookingDetails.id}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${lesson.description ? `\nDescription:\n${lesson.description}\n` : ''}

IMPORTANT INFORMATION:
• Your lesson booking is now active
• For pack bookings, you have ${bookingDetails.sessions_remaining || 10} sessions remaining
• Please contact us to schedule your lesson sessions
• If you need to cancel, please contact us at least 24 hours in advance

We look forward to working with you!

Best regards,
AJH Sports Team
ajh@ajhsports.com.au
      `.trim();
    }

    // Build HTML email template with logo and proper formatting
    const logoUrl = 'https://ajh-sports-308b4.web.app/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png';
    
    // Convert plain text to HTML with better formatting
    let htmlBody = emailBody
      .replace(/\n\n+/g, '</p><p style="margin: 12px 0; line-height: 1.6;">') // Paragraph breaks
      .replace(/\n/g, '<br>') // Line breaks
      .replace(/━━━+/g, '<hr style="border: none; border-top: 2px solid #e0e0e0; margin: 20px 0;">') // Separator lines
      .replace(/BOOKING DETAILS:/g, '<h3 style="color: #030213; font-size: 18px; margin: 20px 0 10px 0;">BOOKING DETAILS:</h3>')
      .replace(/Description:/g, '<h4 style="color: #030213; font-size: 16px; margin: 15px 0 8px 0;">Description:</h4>')
      .replace(/IMPORTANT INFORMATION:/g, '<h4 style="color: #030213; font-size: 16px; margin: 20px 0 10px 0;">IMPORTANT INFORMATION:</h4>')
      .replace(/• /g, '<span style="color: #030213;">•</span> '); // Bullet points
    
    // Wrap in paragraph tags
    htmlBody = `<p style="margin: 0; line-height: 1.6;">${htmlBody}</p>`;

    // Try to send email via Gmail SMTP (if configured)
    if (transporter) {
      try {
        const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'ajh@ajhsports.com.au';
        
        const mailOptions = {
          from: `"AJH Sports" <${emailFrom}>`,
          to: userEmail,
          subject: subject,
          text: emailBody,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f5f7fb; font-family: Arial, sans-serif;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0;">
                <!-- Header with Logo -->
                <div style="background-color: #030213; padding: 30px 20px; text-align: center;">
                  <img src="${logoUrl}" alt="AJH Sports Logo" style="max-width: 120px; height: auto;" />
                </div>
                
                <!-- Success Indicator -->
                <div style="background-color: #f5f7fb; padding: 40px 20px; text-align: center;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom: 20px;">
                        <div style="width: 80px; height: 80px; background-color: #d4edda; border-radius: 50%; margin: 0 auto; text-align: center; line-height: 80px;">
                          <span style="color: #28a745; font-size: 48px; font-weight: bold;">✓</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h2 style="color: #030213; font-size: 28px; margin: 0; font-weight: bold; line-height: 1.3;">
                          ${bookingType === 'event' ? 'Your event has been scheduled!' : 'Your coaching session has been confirmed!'}
                        </h2>
                      </td>
                    </tr>
                  </table>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 30px 20px;">
                  <h2 style="color: #030213; font-size: 24px; margin: 0 0 20px 0; font-weight: bold;">Booking Confirmation</h2>
                  
                  ${htmlBody}
                  
                  <!-- Footer -->
                  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0 20px 0;">
                  <p style="color: #666; font-size: 12px; margin: 0; line-height: 1.5;">
                    This is an automated confirmation email. Please do not reply directly to this email.<br>
                    For inquiries, contact us at <a href="mailto:ajh@ajhsports.com.au" style="color: #030213; text-decoration: none;">ajh@ajhsports.com.au</a>
                  </p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('[Email] ────────────────────────────────────────');
        console.log(`[Email] ✅ Booking confirmation email sent successfully`);
        console.log(`[Email] To: ${userEmail}`);
        console.log(`[Email] Subject: ${subject}`);
        console.log(`[Email] Message ID: ${info.messageId}`);
        console.log('[Email] ────────────────────────────────────────');
        return true;
      } catch (emailError) {
        // Log error but don't fail the webhook
        console.error('[Email] ❌ Error sending email via Gmail SMTP:', emailError.message);
        console.warn('[Email] ⚠️  Falling back to console log only');
        // Continue to console log below
      }
    }

    // Fallback: Log email if transporter not configured or email failed
    console.log('[Email] ────────────────────────────────────────');
    console.log(`[Email] 📧 Booking confirmation email (console log only)`);
    console.log(`[Email] To: ${userEmail}`);
    console.log(`[Email] Subject: ${subject}`);
    console.log(`[Email] Body:\n${emailBody}`);
    console.log('[Email] ────────────────────────────────────────');
    console.log('[Email] 💡 To enable email sending, set EMAIL_USER and EMAIL_PASS in .env');
    console.log('[Email] 💡 Gmail App Password: https://myaccount.google.com/apppasswords');
    console.log('[Email] ────────────────────────────────────────');

    return true;
  } catch (error) {
    console.error('[Email] Error sending booking confirmation email:', error);
    return false;
  }
};
