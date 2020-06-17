const Product = require("../models/product");
const Session = require("../models/sessions");
// exports.getAddProduct = (req, res, next) => {
//   res.render("admin/edit-product", {
//     pageTitle: "Add Product",
//     path: "/admin/add-product",
//     editing: false
//   });
// };

exports.postAddProduct = (req, res, next) => {
  let token = req.token;
  Session.findOne({ "session.token": token })
    .then((response) => {
      const title = req.body.name;
      const imageUrl = req.body.image;
      const price = req.body.price;
      const description = req.body.description;
      const user = response.get("session.user._id");

      const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: user,
      });

      product
        .save()
        .then((result) => {
          res.send("Product added");
          // res.redirect("/admin/products");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log("err :", err));

  // const product = new Product({
  //   title: title,
  //   price: price,
  //   description: description,
  //   imageUrl: imageUrl,
  //   userId: req.user
  // });
  // console.log("req.user :",req.session.user)
  // product
  //   .save()
  //   .then(result => {
  //     console.log("Created Product");
  //     res.send("Product added");
  //     // res.redirect("/admin/products");
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select("title price -_id") // we can select whatever the field we want
    // .populate("userId", "name") // we can only get name in user document
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
