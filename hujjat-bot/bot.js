require('dotenv').config({ path: '../.env' });
console.log("Token topildimi:", process.env.BOT_TOKEN ? "Ha" : "Yo'q");
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

// 2. Bot sozlamalari - ENDI XAVFSIZ!
const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_GROUP_ID = process.env.ADMIN_GROUP_ID; 
const CARD_NUMBER = process.env.CARD_NUMBER; 

const userState = {};

bot.start((ctx) => {
    ctx.reply("Assalamu aleykum! Balansni to'ldirish uchun saytdagi profilingizda ko'rsatilgan 6 xonali ID raqamingizni yuboring (Masalan: 123456).");
});

bot.on('text', async (ctx) => {
    const text = ctx.message.text.trim();
    const tgId = ctx.from.id;

    if (/^\d{6}$/.test(text) && !userState[tgId]) {
        try {
            const userSnap = await db.collection('users').where('paymentId', '==', text).limit(1).get();
            if (userSnap.empty) {
                return ctx.reply("❌ Kechirasiz, bunday ID raqamli foydalanuvchi topilmadi. Iltimos, qayta tekshiring.");
            }

            const userData = userSnap.docs[0].data();
            userState[tgId] = { 
                paymentId: text, 
                authUid: userSnap.docs[0].id, 
                fullName: userData.full_name || "Foydalanuvchi"
            };
            
            return ctx.reply(`👤 Foydalanuvchi: <b>${userState[tgId].fullName}</b>\n\n💰 Balansingizni to'ldirmoqchi bo'lgan summani kiriting (Masalan: 15000) so'm:`, { parse_mode: 'HTML' });
        } catch (error) {
            console.error("Xato:", error);
            ctx.reply("⚠️ Bazaga ulanishda xatolik yuz berdi.");
        }
        return;
    }

    if (userState[tgId] && !userState[tgId].amount) {
        if (!isNaN(text) && Number(text) > 0) {
            userState[tgId].amount = Number(text);
            return ctx.reply(`💳 To'lov qilish uchun karta: <code>${CARD_NUMBER}</code>\n💰 Summa: <b>${userState[tgId].amount.toLocaleString()}</b> so'm\n\n✅ To'lovni amalga oshirgach, chek rasmini (skrinshot) yuboring.`, { parse_mode: 'HTML' });
        } else {
            return ctx.reply("⚠️ Iltimos, summani faqat musbat raqamlarda kiriting.");
        }
    }
});

bot.on('photo', async (ctx) => {
    const tgId = ctx.from.id;
    const state = userState[tgId];

    if (state && state.paymentId && state.amount) {
        const photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;

        try {
            await ctx.telegram.sendPhoto(ADMIN_GROUP_ID, photoId, {
                caption: `💰 <b>Yangi To'lov So'rovi!</b>\n\n🆔 ID: <code>${state.paymentId}</code>\n👤 Ism: <b>${state.fullName}</b>\n💰 Summa: <b>${state.amount.toLocaleString()}</b> so'm\n👤 Telegram: ${ctx.from.first_name}`,
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback('Tasdiqlash ✅', `app_${tgId}`),
                        Markup.button.callback('Rad etish ❌', `rej_${tgId}`)
                    ]
                ])
            });

            ctx.reply("✅ Chek qabul qilindi! Adminlarimiz tez orada tasdiqlaydilar.");
        } catch (error) {
            console.error("Yuborishda xato:", error);
            ctx.reply("❌ Xatolik yuz berdi. Qayta urinib ko'ring.");
        }
    } else {
        ctx.reply("⚠️ Iltimos, avval ID raqamingizni va summani kiriting.");
    }
});

bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;
    const adminName = ctx.from.first_name;

    const [action, targetTgId] = data.split('_');
    const state = userState[targetTgId];

    if (!state) return ctx.answerCbQuery("❌ Bu so'rov muddati o'tgan yoki topilmadi.", { show_alert: true });

    try {
        if (action === 'app') {
            await db.collection('users').doc(state.authUid).update({
                balance: admin.firestore.FieldValue.increment(state.amount)
            });

            await db.collection('payments').add({
                userId: state.paymentId,
                authUid: state.authUid,
                amount: state.amount,
                status: 'completed',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                userName: state.fullName
            });

            await ctx.editMessageCaption(`✅ <b>To'lov Tasdiqlandi!</b>\n\n🆔 ID: <code>${state.paymentId}</code>\n👤 Ism: <b>${state.fullName}</b>\n💰 Summa: <b>${state.amount.toLocaleString()}</b> so'm\n👤 Admin: <b>${adminName}</b>`, { parse_mode: 'HTML' });
            
            await bot.telegram.sendMessage(targetTgId, `✅ To'lovingiz tasdiqlandi!\nBalansingiz <b>${state.amount.toLocaleString()}</b> so'mga to'ldirildi.`, { parse_mode: 'HTML' });

        } else if (action === 'rej') {
            await ctx.editMessageCaption(`❌ <b>To'lov Rad Etildi!</b>\n\n🆔 ID: <code>${state.paymentId}</code>\n👤 Ism: <b>${state.fullName}</b>\n👤 Admin: <b>${adminName}</b>`, { parse_mode: 'HTML' });
            
            await bot.telegram.sendMessage(targetTgId, "❌ Kechirasiz, yuborgan chekingiz rad etildi. Ma'mulotlarni tekshirib qayta yuboring.");
        }

        delete userState[targetTgId];
    } catch (error) {
        console.error("Tasdiqlashda xato:", error);
        ctx.answerCbQuery("⚠️ Xatolik yuz berdi.");
    }
});

bot.launch();
console.log("🚀 Bot xavfsiz holatda ishga tushdi...");

const port = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!');
}).listen(port);