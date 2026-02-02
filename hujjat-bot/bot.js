const { Telegraf, Markup } = require('telegraf');
const admin = require('firebase-admin');

// 1. Firebase Admin ulanishi
const serviceAccount = require("./serviceAccountKey.json");
if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// 2. Bot sozlamalari
const bot = new Telegraf('8541025572:AAH7YG2IexOM25ssuGycIOhpEHWEtNklkUw');
const ADMIN_GROUP_ID = '-1003397664852'; 
const CARD_NUMBER = '8600 0000 0000 0000'; 

const userState = {};

bot.start((ctx) => {
    ctx.reply("Assalamu aleykum! Saytdan olgan to'lov ID raqamingizni yuboring (Masalan: HUJJAT-123456).");
});

bot.on('text', async (ctx) => {
    const text = ctx.message.text.trim();
    if (text.startsWith('HUJJAT-')) {
        userState[ctx.from.id] = { orderId: text };
        return ctx.reply("To'lov summasini kiriting (Masalan: 15000):");
    }
    if (userState[ctx.from.id] && !userState[ctx.from.id].amount) {
        if (!isNaN(text)) {
            userState[ctx.from.id].amount = text;
            return ctx.reply(`💳 Karta: <code>${CARD_NUMBER}</code>\n💰 Summa: <b>${text}</b> so'm\n\nTo'lovdan so'ng chek rasmini yuboring.`, { parse_mode: 'HTML' });
        }
    }
});

// 3. Chek qabul qilish va Adminlarga yuborish
bot.on('photo', async (ctx) => {
    const userId = ctx.from.id;
    const state = userState[userId];
    if (state && state.orderId && state.amount) {
        const { orderId, amount } = state;
        await ctx.telegram.sendMessage(ADMIN_GROUP_ID, 
            `💰 <b>Yangi To'lov So'rovi!</b>\n\n🆔 ID: <code>${orderId}</code>\n💰 Summa: <b>${amount}</b> so'm\n👤 Foydalanuvchi: ${ctx.from.first_name}`,
            {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [
                        // MUHIM: targetUserId tugma ichiga qo'shildi
                        Markup.button.callback('Tasdiqlash ✅', `app_${orderId}_${amount}_${userId}`),
                        Markup.button.callback('Rad etish ❌', `rej_${orderId}_${userId}`)
                    ]
                ])
            }
        );
        ctx.reply("Chek qabul qilindi! Adminlarimiz tez orada tasdiqlaydilar.");
        delete userState[userId];
    }
});

// 4. Tasdiqlash va Rad etish mantiqi
bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;
    const adminName = ctx.from.first_name;

    if (data.startsWith('app_') || data.startsWith('rej_')) {
        const parts = data.split('_');
        const action = parts[0]; 
        const orderId = parts[1];
        
        try {
            const snap = await db.collection('payments').where('orderId', '==', orderId).limit(1).get();
            if (snap.empty) return ctx.answerCbQuery("To'lov bazadan topilmadi!", { show_alert: true });

            const paymentDoc = snap.docs[0];
            const pData = paymentDoc.data();

            if (action === 'app') {
                const amount = Number(parts[2]); // Admin guruhidan kelgan summa
                const targetUserId = parts[3];
            
                // 1. Foydalanuvchi balansini oshirish (Bu qism sizda ishlayapti)
                await db.collection('users').doc(pData.userId).set({
                    balance: admin.firestore.FieldValue.increment(amount)
                }, { merge: true });
            
                // 2. To'lov hujjatini yangilash (MUHIM: amount maydonini qo'shing)
                // Aynan mana shu qator jadvalda 0 so'm o'rniga haqiqiy summani chiqaradi
                await paymentDoc.ref.update({ 
                    status: 'completed',
                    amount: amount // Bazadagi 0 ni kiritilgan summaga o'zgartiradi
                });

                await ctx.editMessageText(`✅ <b>Tasdiqlandi!</b>\n🆔 ID: <code>${orderId}</code>\n💰 Summa: <b>${amount.toLocaleString()}</b> so'm\n👤 Admin: ${adminName}`, { parse_mode: 'HTML' });
                await ctx.telegram.sendMessage(targetUserId, `To'lovingiz ma'qullandi ✅\nBalansingiz <b>${amount.toLocaleString()}</b> so'mga to'ldirildi.`, { parse_mode: 'HTML' });
            } else {
                const targetUserId = parts[2];
                await paymentDoc.ref.update({ status: 'rejected' });
                await ctx.editMessageText(`❌ <b>Rad etildi!</b>\n🆔 ID: <code>${orderId}</code>\n👤 Admin: ${adminName}`, { parse_mode: 'HTML' });
                await ctx.telegram.sendMessage(targetUserId, "To'lov tasdiqlanmadi ❌\nQayta urinib ko'ring yoki admin bilan bog'laning.");
            }
        } catch (e) {
            console.error("Firebase update xatosi:", e);
            ctx.answerCbQuery("Xatolik yuz berdi!");
        }
    }
});

bot.launch();
console.log("🚀 Bot ishga tushdi...");