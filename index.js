const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    StringSelectMenuBuilder,
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle,
    PermissionsBitField,
    ActivityType 
} = require('discord.js');
const { Client: SelfClient } = require('discord.js-selfbot-v13');

// إعداد البوت الرئيسي
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ⚙️ ضَع التوكن الجديد الخاص ببوتك هنا
const BOT_TOKEN = process.env.BOT_TOKEN || "MTU1NzUyNjYwMDU0MTU0NDQ5OQ.Gc64DD.h70eTlnGZ5uyg4yCY5-5PZD5rhI1qo2p6gL4JU";

bot.on('ready', () => {
    console.log(`=================================`);
    console.log(`✅ S7R TEAM CLONER IS READY!`);
    console.log(`👤 Logged in as: ${bot.user.tag}`);
    console.log(`📌 Command: ارسال نسخ سيرفرات`);
    console.log(`=================================`);

    bot.user.setActivity('S7R TEAM | Server Cloner 🚀', { type: ActivityType.Watching });
});

// 📩 الاستجابة لأمر "ارسال نسخ سيرفرات"
bot.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.trim() === 'ارسال نسخ سيرفرات') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ **ليس لديك صلاحية لاستخدام هذا الأمر!**');
        }

        await message.delete().catch(() => {});

        const mainEmbed = new EmbedBuilder()
            .setTitle('⚡ S7R TEAM • SYSTEM CLONER v4.0')
            .setDescription(
                '```ansi\n\u001b[1;35m[ S7R TEAM - ADVANCED DUPLICATOR SYSTEM ]\u001b[0m\n```\n' +
                'مرحباً بك في أسرع وأحدث نظام لنسخ وتفريغ سيرفرات الديسكورد بالكامل.\n\n' +
                '**📌 الخدمات المتاحة داخل النظام:**\n' +
                '• 🚀 **نسخ كامل:** نقل كافة الرومات، الفئات، الرتب وصلاحياتها.\n' +
                '• 🗑️ **تفريغ السيرفر:** مسح جميع القنوات والرتب من السيرفر المستهدف.\n' +
                '• 🎭 **نسخ الرتب فقط:** نقل الرتب والألوان والصلاحيات دون التعديل على الرومات.\n' +
                '• 💬 **نسخ الرومات فقط:** نقل كافة القنوات التكست والفويس والفئات.\n\n' +
                '**⚠️ تعليمات الاستخدام:**\n' +
                '1. اضغط على الزر أدناه أو اختر الخدمة المطلوبة من القائمة.\n' +
                '2. قم بإدخال البيانات المطلوبة (آيدي السيرفرين + توكن حسابك).\n' +
                '3. انتظر ثوانٍ معدودة حتى تكتمل العملية بنجاح.\n'
            )
            .setColor('#9b51e0')
            .setFooter({ text: 'S7R TEAM Security System • All Rights Reserved', iconURL: bot.user.displayAvatarURL() })
            .setTimestamp();

        const selectMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('clone_options_menu')
                .setPlaceholder('⚙️ اختر نوع العملية المطلوبة من هنا...')
                .addOptions([
                    {
                        label: 'نسخ السيرفر بالكامل (Full Clone)',
                        description: 'نسخ جميع الرومات والفئات والرتب والصلاحيات',
                        value: 'mode_full',
                        emoji: '🚀'
                    },
                    {
                        label: 'تفريغ السيرفر المستهدف (Clear Guild)',
                        description: 'حذف كافة القنوات والرتب القديمة فقط',
                        value: 'mode_clear',
                        emoji: '🗑️'
                    },
                    {
                        label: 'نسخ الرتب وصلاحياتها فقط (Roles Only)',
                        description: 'نقل الرتب والألوان والأدوار فقط',
                        value: 'mode_roles',
                        emoji: '🎭'
                    },
                    {
                        label: 'نسخ الرومات والفئات فقط (Channels Only)',
                        description: 'نقل قنوات الكتابة والصوت بدون الرتب',
                        value: 'mode_channels',
                        emoji: '💬'
                    }
                ])
        );

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('start_clone_fast')
                .setLabel('Start Cloning 🚀')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('get_help')
                .setLabel('Support & Token 🎫')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setLabel('S7R TEAM')
                .setURL('https://discord.gg')
                .setStyle(ButtonStyle.Link)
        );

        await message.channel.send({ embeds: [mainEmbed], components: [selectMenu, buttons] });
    }
});

// التعامل مع جميع التفاعلات
bot.on('interactionCreate', async (interaction) => {

    if ((interaction.isButton() && interaction.customId === 'start_clone_fast') || 
        (interaction.isStringSelectMenu() && interaction.customId === 'clone_options_menu')) {

        const selectedMode = interaction.isStringSelectMenu() ? interaction.values[0] : 'mode_full';

        const modal = new ModalBuilder()
            .setCustomId(`modal_process_${selectedMode}`)
            .setTitle('🔐 S7R TEAM - بيانات عملية النسخ');

        const tokenInput = new TextInputBuilder()
            .setCustomId('input_user_token')
            .setLabel('توكن حسابك الشخصي (User Token)')
            .setPlaceholder('ضع توكن الحساب الشخصي هنا...')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const sourceInput = new TextInputBuilder()
            .setCustomId('input_source_id')
            .setLabel('أيدي السيرفر المراد نسخته (Source Guild ID)')
            .setPlaceholder('1533776759080882377')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const targetInput = new TextInputBuilder()
            .setCustomId('input_target_id')
            .setLabel('أيدي السيرفر المستهدف (Target Guild ID)')
            .setPlaceholder('1512786215336673401')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(tokenInput),
            new ActionRowBuilder().addComponents(sourceInput),
            new ActionRowBuilder().addComponents(targetInput)
        );

        await interaction.showModal(modal);
    }

    if (interaction.isButton() && interaction.customId === 'get_help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('❓ كيفية الحصول على التوكن والدعم الفني')
            .setDescription(
                '**طريقة الحصول على التوكن الخطي:**\n' +
                '1. افتح متصفح Google Chrome وادخل إلى ديسكورد.\n' +
                '2. اضغط على `F12` لفتح أدوات المطور (Developer Tools).\n' +
                '3. توجه إلى تبويب `Console` ثم الصق الكود المخصص لاستخراج التوكن.\n\n' +
                '⚠️ **تنبيه أمني:** لا تشارك التوكن الخاص بك مع أي شخص آخر، النظام لدينا يقوم بمعالجة التوكن في الذاكرة المؤقتة وحذفه فوراً بعد اكتمال النسخ.'
            )
            .setColor('#70a1ff');

        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    }

    if (interaction.isModalSubmit() && interaction.customId.startsWith('modal_process_')) {
        const mode = interaction.customId.replace('modal_process_', '');
        const userToken = interaction.fields.getTextInputValue('input_user_token').trim();
        const sourceId = interaction.fields.getTextInputValue('input_source_id').trim();
        const targetId = interaction.fields.getTextInputValue('input_target_id').trim();

        await interaction.reply({
            content: '⚡ **جاري الاتصال بالسيرفرات وبدء التنفيذ...**\nيرجى متابعة التحديثات هنا.',
            ephemeral: true
        });

        executeCloning(interaction, userToken, sourceId, targetId, mode);
    }
});

// دالة تنفيذ العملية المخصصة
async function executeCloning(interaction, userToken, sourceId, targetId, mode) {
    const self = new SelfClient();

    self.on('ready', async () => {
        try {
            const sourceGuild = self.guilds.cache.get(sourceId);
            const targetGuild = self.guilds.cache.get(targetId);

            if (!sourceGuild || !targetGuild) {
                await interaction.editReply('❌ **خطأ:** تعذر العثور على أحد السيرفرات! تأكد من انضمام الحساب للسيرفرين وإعطائه صلاحيات كاملة.');
                return self.destroy();
            }

            // 1. تفريغ السيرفر
            if (mode === 'mode_clear' || mode === 'mode_full') {
                await interaction.editReply('🗑️ **1/3: جاري تفريغ السيرفر المستهدف من القنوات والرتب...**');
                
                for (const ch of targetGuild.channels.cache.values()) {
                    await ch.delete().catch(() => {});
                    await new Promise(r => setTimeout(r, 120));
                }
                for (const rl of targetGuild.roles.cache.values()) {
                    if (rl.name !== '@everyone' && !rl.managed) {
                        await rl.delete().catch(() => {});
                        await new Promise(r => setTimeout(r, 120));
                    }
                }
                if (mode === 'mode_clear') {
                    await interaction.editReply('✅ **تم تفريغ السيرفر بنجاح تام!**');
                    return self.destroy();
                }
            }

            const roleMap = new Map();

            // 2. نسخ الرتب
            if (mode === 'mode_roles' || mode === 'mode_full') {
                await interaction.editReply('🎭 **2/3: جاري نقل وإنشاء الرتب والصلاحيات...**');
                
                const roles = Array.from(sourceGuild.roles.cache.values())
                    .filter(r => r.name !== '@everyone' && !r.managed)
                    .sort((a, b) => a.position - b.position);

                for (const role of roles) {
                    try {
                        const nr = await targetGuild.roles.create({
                            name: role.name,
                            color: role.color,
                            permissions: role.permissions,
                            hoist: role.hoist,
                            mentionable: role.mentionable
                        });
                        roleMap.set(role.id, nr);
                        await new Promise(r => setTimeout(r, 150));
                    } catch (e) {}
                }
                roleMap.set(sourceGuild.roles.everyone.id, targetGuild.roles.everyone);
            }

            // 3. نسخ الرومات والفئات
            if (mode === 'mode_channels' || mode === 'mode_full') {
                await interaction.editReply('📁 **3/3: جاري نقل وإنشاء القنوات والفئات...**');

                const getNewOverwrites = (oldOverwrites) => {
                    const newOw = [];
                    if (oldOverwrites) {
                        oldOverwrites.forEach(ow => {
                            if (roleMap.has(ow.id)) {
                                newOw.push({
                                    id: roleMap.get(ow.id).id,
                                    allow: ow.allow,
                                    deny: ow.deny
                                });
                            }
                        });
                    }
                    return newOw;
                };

                const orphanChannels = sourceGuild.channels.cache.filter(c => !c.parentId && c.type !== 4 && c.type !== 'GUILD_CATEGORY');
                for (const ch of orphanChannels.values()) {
                    try {
                        await targetGuild.channels.create(ch.name, {
                            type: ch.type,
                            topic: ch.topic,
                            nsfw: ch.nsfw,
                            bitrate: ch.bitrate,
                            userLimit: ch.userLimit,
                            permissionOverwrites: getNewOverwrites(ch.permissionOverwrites)
                        });
                        await new Promise(r => setTimeout(r, 150));
                    } catch (e) {}
                }

                const categories = sourceGuild.channels.cache.filter(c => c.type === 4 || c.type === 'GUILD_CATEGORY');
                for (const category of categories.values()) {
                    try {
                        const newCat = await targetGuild.channels.create(category.name, {
                            type: 4,
                            permissionOverwrites: getNewOverwrites(category.permissionOverwrites)
                        });
                        await new Promise(r => setTimeout(r, 150));

                        const catChannels = sourceGuild.channels.cache.filter(c => c.parentId === category.id);
                        for (const ch of catChannels.values()) {
                            await targetGuild.channels.create(ch.name, {
                                type: ch.type,
                                topic: ch.topic,
                                nsfw: ch.nsfw,
                                bitrate: ch.bitrate,
                                userLimit: ch.userLimit,
                                parent: newCat.id,
                                permissionOverwrites: getNewOverwrites(ch.permissionOverwrites)
                            });
                            await new Promise(r => setTimeout(r, 150));
                        }
                    } catch (e) {}
                }
            }

            await interaction.editReply('🎉 **تم اكتمال عملية نسخ الرومات والفئات والرتب بنجاح 100%!**');
            self.destroy();

        } catch (err) {
            await interaction.editReply(`❌ **حدث خطأ أثناء العملية:** ${err.message}`);
            self.destroy();
        }
    });

    self.login(userToken).catch(async () => {
        await interaction.editReply('❌ **التوكن الذي أدخلته غير صحيح أو الحساب محمي بتأكيد بخطوتين.**');
    });
}

bot.login(BOT_TOKEN);
