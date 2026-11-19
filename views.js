const path = require("path");
const Datastore = require("@seald-io/nedb");

const templatesDir = path.join(__dirname, "templates");
const db = new Datastore({ filename: "lvivarc.json", autoload: true });

exports.main = (req, res) => {
  db.find({ table: "arctype" }, (err, docs) => {
    if (err) {
      res.status(500).send("Помилка бази даних");
      return;
    }
    docs.sort((a, b) => a.id - b.id);
    res.render(path.join(templatesDir, "index2"), { types: docs });
  });
};

exports.listObjects = (req, res) => {
  const tpId = parseInt(req.params.id);
  db.find({ table: "arcobj", type_id: tpId }, (err, docs) => {
    if (err) {
      res.status(500).send("Помилка бази даних");
      return;
    }
    if (docs.length === 0) {
      res.status(404).sendFile(path.join(templatesDir, "404.html"));
      return;
    }
    db.findOne({ table: "arctype", id: tpId }, (err, doc) => {
      if (err || !doc) {
        res.status(404).sendFile(path.join(templatesDir, "404.html"));
        return;
      }
      res.render(path.join(templatesDir, "objects"), {
        type: doc,
        objects: docs,
      });
    });
  });
};

exports.arcObject = (req, res) => {
  const objId = parseInt(req.params.id);
  db.findOne({ table: "arcobj", id: objId }, (err, doc) => {
    if (err) {
      res.status(500).send("Помилка бази даних");
      return;
    }
    if (!doc) {
      res.status(404).sendFile(path.join(templatesDir, "404.html"));
      return;
    }
    db.findOne({ table: "arctype", id: doc.type_id }, (err, typeDoc) => {
      res.render(path.join(templatesDir, "object"), {
        object: doc,
        type: typeDoc,
      });
    });
  });
};

exports.error404 = (req, res) => {
  res.status(404).sendFile(path.join(templatesDir, "404.html"));
};
