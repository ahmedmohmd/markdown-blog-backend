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
  req.article.clicks++;
  await req.article.save();
  res.status(200).json(req.article);
});

// set article
router.post("/new", async (req, res) => {
  try {
    const existingArticle = await Article.findOne({ slug: req.body.slug });

    if (!existingArticle) {
      const article = new Article({
        title: req.body.title,
        markdown: req.body.markdown,
        cover: req.body.cover,
      });

      const ar = await article.save();

      return res.status(201).json(ar);
    }
  } catch (error) {
    res
      .status(400)
      .send(
        "Article Title is Already Existed, Try Again With Another Article :("
      );
  }
});

// update article
router.patch("/edit/:slug", getArticle, async (req, res) => {
  try {
    const article = req.article;
    if (req.body.title != null) article.title = req.body.title;
    if (req.body.markdown != null) article.markdown = req.body.markdown;
    if (req.body.cover != null) article.cover = req.body.cover;

    const newArticle = article.save();

    res.status(201).json(newArticle);
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
