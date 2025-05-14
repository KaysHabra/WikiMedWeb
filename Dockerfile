FROM node:18

# تثبيت Ionic CLI
RUN npm install -g @ionic/cli

# تحديد مجلد العمل
WORKDIR /app

# نسخ الملفات الخاصة بالمكتبات فقط
COPY package*.json ./
RUN npm install

# نسخ باقي المشروع
COPY . .

# فتح المنفذ المطلوب
EXPOSE 8100

# تشغيل السيرفر مباشرة داخل Docker
CMD ["ionic", "serve", "--external", "--no-open", "--host=0.0.0.0"]
