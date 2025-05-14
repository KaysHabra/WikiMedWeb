# استخدم صورة node الرسمية
FROM node:18

# إعداد مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات المشروع
COPY . .

# تثبيت Ionic و Angular CLI
RUN npm install -g @angular/cli @ionic/cli

# تثبيت الحزم
RUN npm install

# فتح البورت المناسب
EXPOSE 8100

# أمر التشغيل
CMD ["ionic", "serve", "--host=0.0.0.0", "--port=8100"]
