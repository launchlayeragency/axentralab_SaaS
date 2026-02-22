# Render Deployment Troubleshooting

## Error: "Exited with status 127 while building your code"

**Status 127** = "Command not found" error

---

## **সমাধান: Root Directory সেট করতে হবে**

### **সম্ভাব্য কারণ:**
Render এখনও **root directory** থেকে build করার চেষ্টা করছে, `backend/` থেকে নয়।

---

## **ফিক্স করুন - 3 ধাপ:**

### **Step 1: Render Dashboard যান**
1. যান: https://dashboard.render.com
2. আপনার **Backend Service** খুলুন (যেটি failed হয়েছে)

### **Step 2: Settings এ যান**
1. **Settings** tab ক্লিক করুন
2. নিচে স্ক্রল করুন যতক্ষণ না **"Root Directory"** পান

### **Step 3: Root Directory সেট করুন** ⭐ গুরুত্বপূর্ণ

**এখানে দেখাবে:**
```
Root Directory: (empty box)
```

**এটি ফিল করুন:**
```
backend
```

(বা `backend/` - দুটোই কাজ করে)

### **Step 4: সব সেটিংস ভেরিফাই করুন:**

```
Root Directory: backend
Build Command: npm install && npm run build && npm run prisma:generate
Start Command: npm run start:prod
```

### **Step 5: Save করুন**

সেভ করলে Render automatically **Redeploy** করবে।

---

## **যদি তারপরও ফেইল হয়:**

### **Option A: Build Command Change করুন**

Try this instead:
```
npm install && npm run prisma:generate && npm run build
```

### **Option B: start.sh এর পরিবর্তে Direct Command ব্যবহার করুন**

**Start Command** change করুন:
```
node dist/main
```

(start.sh এর বদলে)

### **Option C: Render CLI দিয়ে Deploy করুন (Advanced)**

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Deploy
render deploy
```

---

## **Debug করুন - Logs দেখুন:**

1. Render Dashboard → Your Service
2. **Logs** tab ক্লিক করুন
3. সম্পূর্ণ error message দেখবেন

যদি দেখান দিন কি error আছে, আরও fix করতে পারি।

---

## **দ্রুত Checklist:**

- [ ] Root Directory = `backend` ✅
- [ ] Build Command সেট আছে ✅
- [ ] Start Command সেট আছে ✅
- [ ] Database connected ✅
- [ ] Redis connected ✅
- [ ] Environment variables সব আছে ✅
- [ ] Redeploy করুন

---

## **এখনই করুন:**

1. Render Dashboard খুলুন
2. Root Directory set করুন to `backend`
3. **Save** টিপুন
4. Render redeploy করবে
5. Logs দেখুন deploy হচ্ছে কিনা

যদি তারপরও problem হয়, সম্পূর্ণ **Error Log** screenshot পাঠান! 📸
