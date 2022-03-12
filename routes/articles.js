// Imports
const Article = require("../models/article");
const { getArticle, paginate } = require("../helpers/middlewares");
const express = require("express");
const router = express.Router();

// Fetch all Articles
router.get("/", paginate(Article), async (req, res) => {
  try {
    res.status(200).json(res.results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch One Article
router.get("/:slug", getArticle, async (req, res) => {
  res.status(200).json(req.article);
});

// set article
router.post("/new", async (req, res) => {
  try {
    const article = new Article({
      title: req.body.title,
      markdown: req.body.markdown,
    });
    article.save();

    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update article
router.patch("/edit/:slug", getArticle, async (req, res) => {
  try {
    const article = req.article;
    if (req.body.title != null) article.title = req.body.title;
    if (req.body.markdown != null) article.markdown = req.body.markdown;

    article.save();

    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an Article
router.delete("/delete/:slug", getArticle, async (req, res) => {
  try {
    const article = req.article;
    article.remove();

    res.status(200).json({ message: "Article is Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
