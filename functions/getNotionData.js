const { Client, LogLevel } = require('@notionhq/client');

const { NOTION_API_TOKEN, NOTION_DATABASE_ID } = process.env;


async function getDatabaseEmoji() {
    const notion = new Client({
        auth: NOTION_API_TOKEN,
    });
    const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID});
    const emojis = response.results.map(page => {
        return {
            id: page.properties.id.formula.string,
            name: page.properties.nombre.rich_text[0].text.content,
            emoji: page.properties.emoji.title[0].text.content
        }
    });
    return emojis
}

module.exports.handler = async function (event, context) {
    if (event.httpMethod != 'GET') {
      return { statusCode: 405, body: 'Method not allowed' };
    }
    const data = await getDatabaseEmoji();
    
    return { statusCode: 201, body: 'ok' , body: JSON.stringify(data)};
};