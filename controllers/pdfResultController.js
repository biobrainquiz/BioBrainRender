const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const ejs = require("ejs");
const pdfResultService = require("../services/pdfResultService");
const logger = require("../utils/logger");

exports.downloadResultPdf = async (req, res) => {
   await pdfResultService.downloadResultPdf(req, res);
};

exports.emailResultPdf = async (req, res) => {
   await pdfResultService.emailResultPdf(req, res);
};

