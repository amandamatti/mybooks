/*    
    Amanda Matti    
    Projekt i kursen DT162G
    Webbutveckling HT18
    Mybooks
*/

// Importera 
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path"); //Hjälper till att navigera i olika kataloger
var mongoose = require("mongoose");

// Anslut till databasen
mongoose.connect("mongodb://mybooksuser:mybooks123@ds251804.mlab.com:51804/mybooksdb", { useNewUrlParser: true });

// Läs in schemat
var Books = require("./app/models/books.js");

// Skapa instans av express
var app = express();

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false }));

// Middleware
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	next();
}); 

// Skapa statisk sökväg
app.use(express.static(path.join(__dirname, 'public')));

// REST-api för böcker

// Skicka alla böcker
app.get("/api/books", function(req, res) {

    Books.find(function(err, Books) {
        if(err) {
            res.send(err);
        }

        res.json(Books);
    });
});

// Lägg till bok
app.post("/api/books/add", function(req, res) {

    // Ny instans av schemat Books
    var book = new Books();

    // Skapa ett nytt objekt
    book.author = req.body.author;
    book.title = req.body.title;
    book.genre = req.body.genre;
    book.summary = req.body.summary;
    book.ISBN = req.body.ISBN;

    // Spara bok och skriva eventuella felmeddelanden
    book.save(function(err) {
        if(err) {
            res.send(err);
        }
    });

    //res.send({ "message" : "Lägger till bok" });
    // Redirect tillbaka till startsidan
    res.redirect("/");
});

// Ta bort bok
app.delete("/api/books/delete/:_id", function(req, res) {
    var deleteId = req.params._id;

    Books.deleteOne({
        _id: deleteId
    }, function(err, Books) {
        if(err) {
            res.send(err)
        }

        res.json({ message: "Bok raderad, id: " + deleteId});
    });
});

// Visa enskild bok
app.get("/api/books/:_id", function(req, res) {

    var id = req.params._id;
    var ind = -1;

    for(var i=0; i<books.length; i++){
        if(books[i]._id == id) ind = i; 
    } 

    res.send(ind>=0?books[ind]:"{}"); 
});

// Uppdatera bok
app.put("/api/books/update/:_id", function(res, req) {

});

// Port för anslutning
var port = 3000;

// Starta servern
app.listen(port, function() {
    console.log("Servern är startad på port " + port);
});