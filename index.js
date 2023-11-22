const { Console, error } = require("console");
const { response } = require("express");
const express = require("express");
const exphbs = require("express-handlebars");
const { request } = require("http");
const mysql = require("mysql2");

const app = express();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

// rotas
app.post("/delete/:id", (request, response) => {
    const { id } = request.body

    const sql = `
    DELETE FROM brooks
    WHERE id = ${id}
`

  conn.query(sql, (error) => {
    if (error) {
        return console.log(error)
    }

    response.redirect("/")

  })
})

app.post("/edit/save", (req, res) => {
    const { id, title, pageqty } = req.body;

    const sql = `
        UPDATE books 
        SET title = '${title}', pageqty = '${pageqty}'
        WHERE id = ${id}
    `;

    conn.query(sql,  (error) => {
        if (error) {
            return console.log(error);
        }

        res.redirect("/")
    });
});
app.post("/register/save", (req, res) => {
    const { title, pageqty } = req.body;

    const query =
        `INSERT INTO books (title, pageqty)
    VALUES (' ${title}', ' ${pageqty}')
    `;
    conn.query(query, (error) => {
        if (error) {
            console.log(error);
            return;
        }

        res.redirect("/");
    });
});

app.get("/edit/:id", (req, res) => {
    const id = req.params.id;

    const sql = `
        SELECT * FROM books 
        WHERE id = ${id}  
    `;

    conn.query(sql, (error, data) => {
        if (error) {
            return console.log(error);
        }

        const book = [0];

        res.render("edit", { book });
    });
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/book/:id", (req, res) => {
    const id = req.params.id;

    const sql = `
    SELECT * FROM books
    WHERE id=${id}`;

    conn.query(sql, (error, data) => {
        if (error) {
            return Console.log(error);
        }
        const book = data[0];

        res.render("book", { book });
    });
});

app.get('/', (req, res) => {
    const sql = 'SELECT * FROM books';

    conn.query(sql, (error, data) => {
        if (error) {
            return console.log(error);
        }

        const books = data;

        res.render("home", { books });
    });


});

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "nodemysql",
    port: 3306

});

conn.connect((error) => {
    if (error) {
        console.log(error);
        return;
    }

    console.log("Conectado ao mysql!");

    app.listen(3000, () => {
        console.log("servidor rodando na porta 3000!");
    });
});