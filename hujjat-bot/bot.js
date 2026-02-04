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
const CARD_NUMBER = '8600 0000 0000 0000'; 

const userState = {};

bot.start((ctx) => {
    ctx.reply("Assalamu aleykum! Saytdan olgan doimiy ID raqamingizni yuboring (Masalan: 123456).");
});

bot.on('text', async (ctx) => {
    const text = ctx.message.text.trim();
    const tgId = ctx.from.id;

    if (/^\d{6}$/.test(text) && !userState[tgId]) {
        try {
            const userSnap = await db.collection('users').where('paymentId', '==', text).limit(1).get();
            if (userSnap.empty) return ctx.reply("❌ Bunday ID topilmadi.");

            const userData = userSnap.docs[0].data();
            userState[tgId] = { 
                paymentId: text, 
                authUid: userSnap.docs[0].id, 
                fullName: userData.full_name 
            };
            return ctx.reply(`👤 Foydalanuvchi: ${userData.full_name}\n💰 Summani kiriting:`);
        } catch (e) { ctx.reply("🔥 Xatolik yuz berdi."); }
    }

    if (userState[tgId] && !userState[tgId].amount && !isNaN(text)) {
        userState[tgId].amount = Number(text);
        return ctx.reply(`💳 Karta: ${CARD_NUMBER}\n💰 Summa: ${text} so'm\nChekni yuboring.`);
    }
});

bot.on('photo', async (ctx) => {
    const state = userState[ctx.from.id];
    if (state && state.amount) {
        const photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        await ctx.telegram.sendPhoto(ADMIN_GROUP_ID, photoId, {
            caption: `💰 Yangi to'lov!\n🆔 ID: ${state.paymentId}\n👤 Ism: ${state.fullName}\n💰 Summa: ${state.amount} so'm`,
            ...Markup.inlineKeyboard([[
                Markup.button.callback('Tasdiqlash ✅', `app_${ctx.from.id}`),
                Markup.button.callback('Rad etish ❌', `rej_${ctx.from.id}`)
            ]])
        });
        ctx.reply("✅ Chek adminlarga yuborildi.");
    }
});

bot.on('callback_query', async (ctx) => {
    const [action, targetTgId] = ctx.callbackQuery.data.split('_');
    const state = userState[targetTgId];
    if (!state) return ctx.answerCbQuery("Muddati o'tgan.");

    try {
        if (action === 'app') {
            // Balansni oshirish
            await db.collection('users').doc(state.authUid).update({
                balance: admin.firestore.FieldValue.increment(state.amount)
            });
            // Tarixga yozish
            await db.collection('payments').add({
                userId: state.paymentId,
                authUid: state.authUid,
                amount: state.amount,
                status: 'completed',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            await ctx.editMessageCaption("✅ Tasdiqlandi!");
            await bot.telegram.sendMessage(targetTgId, "✅ Balansingiz to'ldirildi!");
        } else {
            await ctx.editMessageCaption("❌ Rad etildi!");
        }
        delete userState[targetTgId];
    } catch (e) { ctx.answerCbQuery("Xato!"); }
});

bot.launch();
http.createServer((req, res) => res.end('Running')).listen(process.env.PORT || 10000);