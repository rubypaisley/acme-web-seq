const express = require('express');
const app = express();
const {Page, Content, setupDB} = require('./db');


const PORT = process.env.PORT || 3000;

const init = async () =>{
    try {
        await setupDB();
    } catch (e) { console.log(e) }

    app.listen(PORT, () => {
        console.log(`app listening in port ${PORT}`);
    });
}

init();

app.get('/', (req, res, next) => {
    res.redirect('/pages/1');
});

app.get('/pages/:id',  async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const pages = await Page.findAll();
            const current = await Page.findByPk(id);
            const currentPage = await Content.findAll({where: {
                pageId: id
            }});
            res.send(`<html>
            <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css" integrity="sha384-PmY9l28YgO4JwMKbTvgaS7XNZJ30MK9FAZjjzXtlqyZCqBY6X6bXIkM++IkyinN+" crossorigin="anonymous">
            </head>
            <body>
                <h1>Acme Web</h1>
                <h2>${current.name}</h2>
                <div class='navbar navbar-default'>
                <ul class='nav navbar-nav'>
                    ${ pages.map(page => {
                        return `<li><a href ='/pages/${page.id}'>${page.name}</a></li>`;
                    }).join('')
                    }
                </ul>
                </div>
                <div class='container-fluid'>
                    ${ currentPage.map(item => {
                        return `<h3 class='row'>${item.heading}</h3>
                        <p class='row'>${item.body}</p>
                        `;
                    } ).join('')}
                </div>
            </body>
            </html>`)
        }
        catch (e) { next(e) }
    
})

