import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private templates: Map<string, handlebars.TemplateDelegate> = new Map();

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
    this.loadTemplates();
  }

  private initializeTransporter(): void {
    const smtpConfig = this.configService.get('smtp');

    this.transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password,
      },
    });
  }

  private loadTemplates(): void {
    const templatesDir = path.join(process.cwd(), 'email-templates');

    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
      this.createDefaultTemplates();
    }

    const files = fs.readdirSync(templatesDir);

    for (const file of files) {
      if (file.endsWith('.hbs')) {
        const templateName = file.replace('.hbs', '');
        const templatePath = path.join(templatesDir, file);
        const templateContent = fs.readFileSync(templatePath, 'utf8');

        this.templates.set(templateName, handlebars.compile(templateContent));
      }
    }
  }

  private createDefaultTemplates(): void {
    const templatesDir = path.join(process.cwd(), 'email-templates');

    // قالب البريد العربي
    const arabicTemplate = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            background: #2E7D32;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            padding: 30px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
        }
        .button {
            display: inline-block;
            background: #2E7D32;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{title}}</h1>
        </div>
        <div class="content">
            <p>عزيزي/عزيزتي {{userName}}،</p>
            <p>{{message}}</p>
            
            {{#if buttonUrl}}
            <div style="text-align: center;">
                <a href="{{buttonUrl}}" class="button">{{buttonText}}</a>
            </div>
            {{/if}}
            
            {{#if additionalInfo}}
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                {{additionalInfo}}
            </div>
            {{/if}}
            
            <p>مع تحيات،<br>فريق نظام التسجيل المهني</p>
        </div>
        <div class="footer">
            <p>هذا بريد إلكتروني تلقائي، يرجى عدم الرد عليه</p>
            <p>© {{currentYear}} نظام التسجيل المهني للمهندسين والتقنيين الزراعيين</p>
        </div>
    </div>
</body>
</html>
`;

    // قالب البريد الإنجليزي
    const englishTemplate = `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>
        /* Same styles as Arabic but LTR */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{title}}</h1>
        </div>
        <div class="content">
            <p>Dear {{userName}},</p>
            <p>{{message}}</p>
            
            {{#if buttonUrl}}
            <div style="text-align: center;">
                <a href="{{buttonUrl}}" class="button">{{buttonText}}</a>
            </div>
            {{/if}}
            
            {{#if additionalInfo}}
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                {{additionalInfo}}
            </div>
            {{/if}}
            
            <p>Best regards,<br>Professional Registry System Team</p>
        </div>
        <div class="footer">
            <p>This is an automated email, please do not reply</p>
            <p>© {{currentYear}} Professional Registry System for Agricultural Engineers and Technicians</p>
        </div>
    </div>
</body>
</html>
`;

    fs.writeFileSync(path.join(templatesDir, 'ar-welcome.hbs'), arabicTemplate);
    fs.writeFileSync(
      path.join(templatesDir, 'en-welcome.hbs'),
      englishTemplate,
    );
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    template: string;
    data: any;
    language?: string;
  }): Promise<void> {
    try {
      const lang = options.language || 'ar';
      const templateName = `${lang}-${options.template}`;
      const template =
        this.templates.get(templateName) ||
        this.templates.get(`ar-${options.template}`);

      if (!template) {
        throw new Error(`Template ${templateName} not found`);
      }

      const html = template({
        ...options.data,
        currentYear: new Date().getFullYear(),
      });

      const mailOptions = {
        from: this.configService.get('smtp.from'),
        to: options.to,
        subject: options.subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }

  async sendWelcomeEmail(user: any, language: string = 'ar'): Promise<void> {
    await this.sendEmail({
      to: user.email,
      subject:
        language === 'ar'
          ? 'مرحباً بك في نظام التسجيل المهني'
          : 'Welcome to the Professional Registry System',
      template: 'welcome',
      data: {
        title: language === 'ar' ? 'مرحباً بك' : 'Welcome',
        userName: `${user.firstName} ${user.lastName}`,
        message:
          language === 'ar'
            ? 'شكراً لتسجيلك في نظام التسجيل المهني للمهندسين والتقنيين الزراعيين. يمكنك الآن بدء عملية التسجيل للحصول على اللقب المهني.'
            : 'Thank you for registering in the Professional Registry System for Agricultural Engineers and Technicians. You can now start the process of obtaining your professional title.',
        buttonUrl: `${this.configService.get('app.url')}/dashboard`,
        buttonText:
          language === 'ar' ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard',
      },
      language,
    });
  }

  async sendTitleApprovalEmail(
    user: any,
    titleInfo: any,
    language: string = 'ar',
  ): Promise<void> {
    await this.sendEmail({
      to: user.email,
      subject:
        language === 'ar'
          ? `تم منحك لقب ${titleInfo.title}`
          : `You have been granted the ${titleInfo.title} title`,
      template: 'title-approval',
      data: {
        title:
          language === 'ar'
            ? 'مبروك! تم منحك اللقب المهني'
            : 'Congratulations! Professional Title Granted',
        userName: `${user.firstName} ${user.lastName}`,
        message:
          language === 'ar'
            ? `يسرنا إعلامك بأنه تم منحك لقب <strong>${titleInfo.title}</strong> برقم الشهادة <strong>${titleInfo.certificateNumber}</strong>.`
            : `We are pleased to inform you that you have been granted the <strong>${titleInfo.title}</strong> title with certificate number <strong>${titleInfo.certificateNumber}</strong>.`,
        additionalInfo:
          language === 'ar'
            ? `تاريخ المنح: ${new Date(titleInfo.awardedDate).toLocaleDateString('ar-SA')}<br>تاريخ الانتهاء: ${new Date(titleInfo.expiryDate).toLocaleDateString('ar-SA')}`
            : `Grant Date: ${new Date(titleInfo.awardedDate).toLocaleDateString('en-US')}<br>Expiry Date: ${new Date(titleInfo.expiryDate).toLocaleDateString('en-US')}`,
        buttonUrl: `${this.configService.get('app.url')}/certificates/${titleInfo.certificateNumber}`,
        buttonText: language === 'ar' ? 'عرض الشهادة' : 'View Certificate',
      },
      language,
    });
  }
}
