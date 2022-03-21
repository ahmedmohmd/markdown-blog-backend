// Imports
const Article = require("../models/article");
const {
  getArticle,
  paginate,
  paginateAuth,
  getPublicArticle,
} = require("../helpers/middlewares");
const express = require("express");
const auth = require("../helpers/auth");
const router = express.Router();

// Fetch all Articles
router.get("/", paginate(Article), async (req, res) => {
  try {
    res.status(200).json(res.results);
  } catch (error) {
    res.status(500).send("An Error Occured!");
  }
});

// Fetch User Articles
router.get("/all", auth, paginateAuth(Article), async (req, res) => {
  try {
    res.status(200).json(res.results);
  } catch (error) {
    res.status(500).send("An Error Occured!");
  }
});

// Fetch Publci Article Article
router.get("/public/:slug", getPublicArticle, async (req, res) => {
  req.article.clicks++;
  await req.article.save();
  res.status(200).json(req.article);
});

// Fetch One Article
router.get("/:slug", auth, getArticle, async (req, res) => {
  await req.article.save();
  res.status(200).json(req.article);
});

// set article
router.post("/new", auth, async (req, res) => {
  try {
    const article = new Article({
      title: req.body.title,
      markdown: req.body.markdown,
      cover: req.body.cover,
      owner: req.user._id,
      ownerName: req.user.name,
    });

    await article.save();
    return res.status(201).json(article);
  } catch (error) {
    res.status(400).send("Article Title is Existed!");
  }
});

// update article
router.patch("/edit/:slug", auth, getArticle, async (req, res) => {
  try {
    const article = req.article;

    if (req.body.title != null) article.title = req.body.title;
    if (req.body.markdown != null) article.markdown = req.body.markdown;
    if (req.body.cover != null) article.cover = req.body.cover;

    const newArticle = await article.save();

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).send("Article Title is Existed!");
  }
});

// Delete an Article
router.delete("/delete/:slug", auth, getArticle, async (req, res) => {
  const article = req.article;
  article.remove();

  res.status(200).send();
});

module.exports = router;
