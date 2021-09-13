//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");


const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb+srv://admin-himanshika:test123@cluster0.ytfws.mongodb.net/todolistDB", { useNewUrlParser: true });

const intemSchema = {
  name: String,
  quantity: Number
};

const Item = mongoose.model("Item", intemSchema);

const item1 = new Item({
  name: "Eggs",
  quantity: "12"
});

const item2 = new Item({
  name: "Milk",
  quantity: "1"
});

const item3 = new Item({
  name: "Bread",
  quantity: "1"
});

const defaultItem = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [intemSchema]
}

const List = mongoose.model("List", listSchema);
//
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems){
if (Item.length === 0){
  Item.insertMany(defaultItem, function(err){
    if (err){
      console.log(err);
    }
    else{
      console.log("Succesfully registered default items");
    }
  });
  res.redirect("/")
}

    res.render("list", {listTitle: "Today", newListItems: foundItems});
  })

});


app.get("/:customListName", function(req, res){
  const customListName = req.params.customListName;

  const list = new List({
    name: customListName,
    items: defaultItem
  });

  List.findOne({name: customListName}, function(err, foundList){
    if(!err){

    }
  });
  list.save();
});


app.post("/", function(req, res){

  const itemName = req.body.newItem;
   let newItem = new Item({
     name: itemName,
     quantity: 1
   });
newItem.save();
res.redirect("/");
  });

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}
app.listen(port);

app.listen(port, function() {
  console.log("Server started on port 4000");
});
