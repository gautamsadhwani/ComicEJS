const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()
const path = require ('path')
const BookModel = require('./models/books')

app.set("view engine", "ejs")
app.use(express.json())
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
     res.render('index')
})

app.get('/createbook', (req, res)=> {
    res.render('createbook')
})

app.post('/create', async (req, res)=> {
    let {name, authorname, year, price, discount , pages, condition, description} = req.body;
  
    let createdUser = await BookModel.create({
             name,
             authorname, 
              year, 
             price,
              discount ,
               pages, 
               condition, 
               description,
  
    })
  

    res.redirect("read")
})

app.get('/read', async (req, res)=> {
    let page = parseInt(req.query.page) || 1;  // Agar query mein page nahi diya to default 1 hoga
    let limit = parseInt(req.query.limit) || 5;  // Agar query mein limit nahi diya to default 5 books dikhengi
   
    try {
    let book = await BookModel.find()
    //finding every book present
    
    .skip((page - 1) * limit) // Skip previous pages
    .limit(limit); // Limit results per page

let totalBooks = await BookModel.countDocuments(); // Total number of books
let totalPages = Math.ceil(totalBooks / limit); // Calculate total pages 

    res.render("read", {book, 
        totalPages,
         currentPage: page,
        limit: limit,});
} catch (err) {
    console.error(err)
    res.status(500).send("Server Error");
}
})

app.get('/edit/:id', async (req, res)=> {
   
    let book = await BookModel.findOne({_id:req.params.id}) 
    console.log(book);
    res.render("edit", {book});
})

app.get('/delete/:id', async (req, res)=> {
    let book = await BookModel.findOneAndDelete({_id:req.params.id}) 
     res.redirect("/read")
 })
 
 app.post('/update/:id', async (req, res) => {
    try {
        let { name, authorname, price, year, condition, discount, description, pages } = req.body;


        let book = await BookModel.findOneAndUpdate(
            { _id: req.params.id },
            { name, authorname, pages, year, price, discount, condition, description },
            { new: true }
        );

        // Check if the book was found and updated
       

        res.redirect("/read");
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


app.listen(3002);