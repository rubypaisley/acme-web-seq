const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL, { logging: false });

const Page = db.define('page', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isHomepage: {
        type: Sequelize.BOOLEAN,
        allNull: false,
        defaultValue: false
    }
})

const Content = db.define('content', {
    heading: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

const setupDB = async () => {

    try {
    Content.belongsTo(Page);
    Page.hasMany(Content);

    await db.sync({ force: true });

    const [homePage, employeePage, contactPage] = await Promise.all([
        Page.create({name: 'Home', isHomepage: true}),
        Page.create({name: 'Employees'}),
        Page.create({name: 'Contact'})
    ]);

    const createHomeContent = await Promise.all([
        Content.create({heading: 'Welcome Home 1', body: 'xoxoxoxox'}),
        Content.create({heading: 'Welcome Home 2', body: 'xoxoxoxox'})
    ]);

    const associatedHomeContent = await createHomeContent.forEach( item => item.setPage(homePage));
  
    const createEmployeeContent = await Promise.all([
        Content.create({heading: 'Bubbles', body: 'CEO'}),
        Content.create({heading: 'Blossom', body: 'CTO'}),
        Content.create({heading: 'Buttercup', body: 'COO'})
    ]);

    const associatedEmployeeContent = await createEmployeeContent.forEach( item => item.setPage(employeePage));

    const createContactContent = await Promise.all([
        Content.create({heading: 'Fax', body: '123-456-7890'}),
        Content.create({heading: 'Phone', body: '555-123-4567'})
    ]);

    const associatedContactContent = await createContactContent.forEach( item => item.setPage(contactPage));
} catch (e) { console.log(e) }
}

const getPages = () => {

}

const getPage = (id) => {

}

module.exports ={
    Page,
    Content,
    setupDB
}

