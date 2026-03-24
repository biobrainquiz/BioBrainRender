const fs = require("fs");
const path = require("path");

const Exam = require("../models/Exam");
const Subject = require("../models/Subject");
const Unit = require("../models/Unit");
const Topic = require("../models/Topic");
const Question = require("../models/Question");
const logger = require("./logger");

async function exportDB() {
    try {
        const backupDir = path.join(__dirname, "../datafeed/latestbkup");
        const questionsDir = path.join(backupDir, "questions");

        // ✅ Ensure directories exist
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        if (!fs.existsSync(questionsDir)) {
            fs.mkdirSync(questionsDir, { recursive: true });
        }

        // 🧹 Clean old question files
        if (fs.existsSync(questionsDir)) {
            fs.readdirSync(questionsDir).forEach(file => {
                if (file.startsWith("questiontable_") && file.endsWith(".json")) {
                    fs.unlinkSync(path.join(questionsDir, file));
                }
            });
        }

        // 📥 Fetch data
        const exams = await Exam.find().lean();
        const subjects = await Subject.find().lean();
        const units = await Unit.find().lean();
        const topics = await Topic.find().lean();
        const questions = await Question.find().lean();

        // 💾 Save master tables
        fs.writeFileSync(
            path.join(backupDir, "examtable.json"),
            JSON.stringify(exams, null, 2)
        );

        fs.writeFileSync(
            path.join(backupDir, "subjecttable.json"),
            JSON.stringify(subjects, null, 2)
        );

        fs.writeFileSync(
            path.join(backupDir, "unittable.json"),
            JSON.stringify(units, null, 2)
        );

        fs.writeFileSync(
            path.join(backupDir, "topictable.json"),
            JSON.stringify(topics, null, 2)
        );

        // 🔥 Group questions
        const grouped = {};

        questions.forEach(q => {
            const key = `${q.examcode}_${q.subjectcode}_${q.unitcode}`;

            if (!grouped[key]) {
                grouped[key] = [];
            }

            grouped[key].push(q);
        });

        

        // 💾 Write grouped files
        Object.keys(grouped).forEach(key => {
            const filename = `questiontable_${key}.json`;
            const filePath = path.join(questionsDir, filename);

            fs.writeFileSync(
                filePath,
                JSON.stringify(grouped[key], null, 2)
            );
        });

        logger.info("✅ Database exported successfully with grouped question files");

    } catch (error) {
        logger.error("❌ Error exporting database:", error);
    }
}


async function exportDB1() {

    const backupDir = path.join(__dirname, "../datafeed/latestbkup");

    // create directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const exams = await Exam.find().lean();
    const subjects = await Subject.find().lean();
    const units = await Unit.find().lean();
    const topics = await Topic.find().lean();
    const questions = await Question.find().lean();

    fs.writeFileSync(path.join(backupDir, "examtable.json"), JSON.stringify(exams, null, 2));
    fs.writeFileSync(path.join(backupDir, "subjecttable.json"), JSON.stringify(subjects, null, 2));
    fs.writeFileSync(path.join(backupDir, "unittable.json"), JSON.stringify(units, null, 2));
    fs.writeFileSync(path.join(backupDir, "topictable.json"), JSON.stringify(topics, null, 2));
    fs.writeFileSync(path.join(backupDir, "questiontable.json"), JSON.stringify(questions, null, 2));

    logger.info("✅ Database exported to JSON files");
}

module.exports = exportDB;