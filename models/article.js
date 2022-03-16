// Imports
const mongoose = require("mongoose");
const slugify = require("slugify");
const createDomPurifier = require("dompurify");
const { JSDOM } = require("jsdom");
const { marked } = require("marked");
const dompurify = createDomPurifier(new JSDOM().window);

// Article Schema
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    markdown: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
    },

    cover: {
      type: String,
    },
    
    sanitizedHtml: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

articleSchema.pre("validate", async function (next) {
  if (this.title) {
    this.slug = slugify(this.title, {
      strict: true,
      lower: true,
    });
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }

  next();
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
