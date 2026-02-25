using System.Net;
using System.Text;
using Birthday.DTOs;
using Birthday.Models;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using Serilog;

namespace Birthday.Services;

public sealed class EmailService(IOptions<EmailOptions> emailOptions, Serilog.ILogger logger) : IEmailService
{
    private readonly EmailOptions _emailOptions = emailOptions.Value;
    private readonly Serilog.ILogger _logger = logger;

    public async Task<DateTime> SendEmailAsync(string name, int adultsNumber, int childrensNumber, string note, string subject, IReadOnlyCollection<Person> confirmedPersons, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.Information("Starting email send process for person: {PersonName} with subject: {Subject}",
                name, subject);

            var email = new MimeMessage();

            email.From.Add(new MailboxAddress(_emailOptions.SenderName, _emailOptions.From));
            email.To.AddRange(InternetAddressList.Parse(_emailOptions.To));

            email.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = CreateEmailHtmlBody(name, adultsNumber, childrensNumber, note)
            };

            var csvBytes = Encoding.UTF8.GetBytes(CreateConfirmedPersonsCsv(confirmedPersons));
            bodyBuilder.Attachments.Add("confirmed-participants.csv", csvBytes, ContentType.Parse("text/csv"));

            email.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();

            // Disable certificate validation for development environments
            client.ServerCertificateValidationCallback = (s, c, ch, e) => true;

            await client.ConnectAsync(_emailOptions.Server, _emailOptions.Port, MailKit.Security.SecureSocketOptions.StartTls, cancellationToken);

            await client.AuthenticateAsync(_emailOptions.Username, _emailOptions.Password, cancellationToken);

            await client.SendAsync(email, cancellationToken);

            await client.DisconnectAsync(true, cancellationToken);

            var timestamp = DateTime.UtcNow;
            return timestamp;
        }
        catch (Exception ex)
        {
            _logger.Error(ex, "An error occurred while sending email for person: {PersonName}", name);
            throw;
        }
    }

    private static string CreateConfirmedPersonsCsv(IReadOnlyCollection<Person> confirmedPersons)
    {
        var rows = new StringBuilder();
        rows.AppendLine("Nom,Nombre Adultes,Nombre Enfants,Note,Id Invitation");

        foreach (var person in confirmedPersons)
        {
            rows.AppendLine(string.Join(",",
                EscapeCsv(person.Name),
                person.AdultsNumber.ToString(),
                person.ChildrensNumber.ToString(),
                EscapeCsv(person.Note),
                person.InvitationId));
        }

        return rows.ToString();
    }

    private static string EscapeCsv(string? value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return "\"\"";
        }

        var escaped = value.Replace("\"", "\"\"");
        return $"\"{escaped}\"";
    }


    private static string CreateEmailHtmlBody(string name, int adultsNumber, int childrensNumber, string note)
    {
        var totalAttendees = adultsNumber + childrensNumber;
        var noteContent = string.IsNullOrWhiteSpace(note)
          ? "No special notes provided."
          : note;

        return $$"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
            }

            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .header {
                background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }

            .header h1 {
                margin: 0 0 10px 0;
                font-size: 28px;
                font-weight: 600;
            }

            .header p {
                margin: 0;
                font-size: 16px;
                opacity: 0.95;
            }

            .content {
                padding: 30px 20px;
            }

            .greeting {
                margin-bottom: 30px;
                font-size: 16px;
                color: #666;
            }

            .info-card {
                background-color: #f8f9fa;
                border-left: 4px solid #007BFF;
                padding: 20px;
                margin-bottom: 20px;
                border-radius: 4px;
            }

            .guest-name {
                font-size: 20px;
                font-weight: 600;
                color: #007BFF;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
            }

            .guest-name::before {
                content: "👤 ";
                margin-right: 5px;
                font-size: 24px;
            }

            .detail-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 10px 0;
                margin-bottom: 15px;
            }

            .detail-cell {
                padding: 10px 15px;
                background-color: white;
                border-radius: 4px;
                border: 1px solid #e0e0e0;
            }

            .detail-label {
                font-size: 12px;
                color: #999;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
                display: block;
            }

            .detail-value {
                font-size: 18px;
                font-weight: 600;
                color: #333;
            }

            .notes-section {
                background-color: #f0f7ff;
                border: 1px solid #d0e3ff;
                border-radius: 4px;
                padding: 15px;
                margin-top: 20px;
            }

            .notes-label {
                font-size: 12px;
                color: #0056b3;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
                display: block;
                font-weight: 600;
            }

            .notes-content {
                font-size: 14px;
                color: #333;
                line-height: 1.6;
                word-wrap: break-word;
            }

            .summary {
                background-color: #e7f3ff;
                border-left: 4px solid #007BFF;
                padding: 15px;
                margin-top: 20px;
                border-radius: 4px;
            }

            .summary-text {
                font-size: 14px;
                color: #333;
                margin: 5px 0;
            }

            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #999;
                border-top: 1px solid #e0e0e0;
            }

            .footer p {
                margin: 5px 0;
            }

            .divider {
                height: 1px;
                background-color: #e0e0e0;
                margin: 20px 0;
            }

            @media (max-width: 600px) {
                .email-container {
                    margin: 0;
                    border-radius: 0;
                }

                .header {
                    padding: 30px 15px;
                }

                .header h1 {
                    font-size: 24px;
                }

                .content {
                    padding: 20px 15px;
                }

                .detail-table {
                    border-spacing: 0;
                }

                .detail-cell {
                    display: block;
                    width: 100%;
                    margin-bottom: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <h1>🎉 New Guest RSVP</h1>
                <p>Guest Confirmation Received</p>
            </div>

            <!-- Main Content -->
            <div class="content">
                <p class="greeting">Hello Administrator,</p>

                <p>A guest has successfully submitted their RSVP for your birthday celebration. Here are the details:</p>

                <!-- Guest Info Card -->
                <div class="info-card">
                    <div class="guest-name">{{name}}</div>

                    <!-- Attendance Details -->
                    <table class="detail-table">
                        <tr>
                            <td class="detail-cell" style="width: 50%;">
                                <span class="detail-label">👥 Adults</span>
                                <span class="detail-value">{{adultsNumber}}</span>
                            </td>
                            <td class="detail-cell" style="width: 50%;">
                                <span class="detail-label">👶 Children</span>
                                <span class="detail-value">{{childrensNumber}}</span>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Notes Section -->
                <div class="notes-section">
                    <span class="notes-label">📝 Special Notes</span>
                    <div class="notes-content">{{noteContent}}</div>
                </div>

                <!-- Summary Section -->
                <div class="summary">
                    <div class="summary-text"><strong>Total Attendees:</strong> {{totalAttendees}} guest(s)</div>
                    <div class="summary-text">• {{adultsNumber}} adult(s)</div>
                    <div class="summary-text">• {{childrensNumber}} child(ren)</div>
                </div>

                <div class="divider"></div>

                <p style="font-size: 14px; color: #666; margin-top: 20px;">
                    Thank you for managing your birthday celebration!
                </p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>&copy; 2026 Birthday Celebration Management System</p>
                <p>This is an automated message. Please do not reply directly to this email.</p>
            </div>
        </div>
    </body>
    </html>
    """;
    }
}

