require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.commandArray = [];

const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    client.commandArray.push(command.data.toJSON());
}

client.once('ready', () => {
    console.log('🚀 Bot Başarıyla Aktif Edildi!');
    console.log(`✅ ${client.user.tag} olarak giriş yapıldı!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
        console.log(`💬 ${interaction.commandName} komutu başarıyla çalıştırıldı!`);
    } catch (error) {
        console.error('❌ Komutu çalıştırırken bir hata oluştu:', error);
        await interaction.reply({ content: '⚠️ Komutu çalıştırırken bir hata oluştu!', ephemeral: true });
    }
});

client.login(process.env.TOKEN);
