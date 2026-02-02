const { Telegraf, Markup } = require('telegraf');
const admin = require('firebase-admin');
const http = require('http');

// 1. Firebase Admin ulanishi
const firebaseConfig = process.env.FIREBASE_CONFIG 
    ? JSON.parse(process.env.FIREBASE_CONFIG) 
    : require("./serviceAccountKey.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig)
    });
}
const db = admin.firestore();

// 2. Bot sozlamalari
const bot = new Telegraf('8541025572:AAH7YG2IexOM25ssuGycIOhpEHWEtNklkUw');
const ADMIN_GROUP_ID = '-1003397664852'; 
const CARD_NUMBER = '8600 0000 0000 0000'; // O'zingizning karta raqamingizni yozing

const userState = {};

bot.start((ctx) => {
    ctx.reply("Assalamu aleykum! Saytdan olgan to'lov ID raqamingizni yuboring (Masalan: HUJJAT-123456).");
});

bot.on('text', async (ctx) => {
    const text = ctx.message.text.trim();
    const userId = ctx.from.id;
    
    // To'lov ID qabul qilish
    if (text.startsWith('HUJJAT-')) {
        userState[userId] = { orderId: text };
        return ctx.reply("💰 To'lov summasini kiriting (Masalan: 15000):");
    }
    
    // Summa qabul qilish
    if (userState[userId] && !userState[userId].amount) {
        if (!isNaN(text)) {
            userState[userId].amount = text;
            return ctx.reply(`💳 Karta: <code>${CARD_NUMBER}</code>\n💰 Summa: <b>${text}</b> so'm\n\nTo'lovdan so'ng chek rasmini (skrinshot) yuboring.`, { parse_mode: 'HTML' });
        } else {
            return ctx.reply("Iltimos, summani faqat raqamlarda kiriting.");
        }
    }

    // Agar foydalanuvchi rasm o'rniga yozuv yuborsa
    if (userState[userId] && userState[userId].amount) {
        return ctx.reply("⚠️ Iltimos, to'lov chekini (rasm/skrinshot) yuboring.");
    }
});

// 3. Rasm (Chek) qabul qilish
bot.on('photo', async (ctx) => {
    const userId = ctx.from.id;
    const state = userState[userId];
    
    // Agar foydalanuvchi ID va summani kiritgan bo'lsa
    if (state && state.orderId && state.amount) {
        const { orderId, amount } = state;
        const photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;

        try {
            // Admin guruhiga/kanaliga yuborish
            await ctx.telegram.sendPhoto(ADMIN_GROUP_ID, photoId, {
                caption: `💰 <b>Yangi To'lov So'rovi!</b>\n\n🆔 ID: <code>${orderId}</code>\n💳 Karta raqami: <code>${CARD_NUMBER}</code>\n💰 To'lov summasi: <b>${amount.toLocaleString()}</b> so'm\n👤 Foydalanuvchi: <b>${ctx.from.first_name}</b>`,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback('Tasdiqlash ✅', `app_${orderId}_${amount}_${userId}`),
                        Markup.button.callback('Rad etish ❌', `rej_${orderId}_${userId}`)
                    ]
                ])
            });

            // Foydalanuvchiga tasdiq xabari
            await ctx.reply("✅ Chek qabul qilindi! Adminlarimiz tez orada tasdiqlaydilar.");
            
            // Holatni o'chirish
            delete userState[userId];
        } catch (error) {
            console.error("Yuborishda xato:", error);
            ctx.reply("❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
        }
    } else {
        // Tartib buzilgan bo'lsa
        ctx.reply("⚠️ Iltimos, avval to'lov ID-sini yuboring va summani kiriting.");
    }
});

// 4. Tasdiqlash tugmalari
bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;
    const adminName = ctx.from.first_name;

    if (data.startsWith('app_') || data.startsWith('rej_')) {
        const parts = data.split('_');
        const action = parts[0]; 
        const orderId = parts[1];
        
        try {
            const snap = await db.collection('payments').where('orderId', '==', orderId).limit(1).get();
            if (snap.empty) return ctx.answerCbQuery("To'lov topilmadi!", { show_alert: true });

            const paymentDoc = snap.docs[0];
            const pData = paymentDoc.data();

            if (action === 'app') {
                const amount = Number(parts[2]);
                const targetUserId = parts[3];

                await db.collection('users').doc(pData.userId).set({
                    balance: admin.firestore.FieldValue.increment(amount)
                }, { merge: true });

                await paymentDoc.ref.update({ status: 'completed', amount: amount });

                await ctx.editMessageCaption(`✅ <b>Tasdiqlandi!</b>\n🆔 ID: <code>${orderId}</code>\n💰 Summa: <b>${amount.toLocaleString()}</b> so'm\n👤 Admin: ${adminName}`, { parse_mode: 'HTML' });
await ctx.telegram.sendMessage(targetUserId, `✅ To'lovingiz ma'qullandi!\nBalansingiz ${amount.toLocaleString()} so'mga to'ldirildi.`);            } else {
                const targetUserId = parts[2];
                await paymentDoc.ref.update({ status: 'rejected' });
                await ctx.editMessageCaption(`❌ <b>Rad etildi!</b>\n🆔 ID: <code>${orderId}</code>\n👤 Admin: ${adminName}`, { parse_mode: 'HTML' });
                await ctx.telegram.sendMessage(targetUserId, "❌ Kechirasiz, to'lovingiz rad etildi.");
            }
        } catch (e) {
            ctx.answerCbQuery("Xatolik!");
        }
    }
});

bot.launch();
console.log("🚀 Bot ishga tushdi...");

// Keep-alive server
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Bot is running!');
    res.end();
}).listen(port);