app.post('/load_xml', upload.single('xml'), async function (req, res) {
    if (!req.file) {
        res.sendStatus(500);
        return;
    }

    try {
        const xml = req.file.buffer;
        const doc = libxmljs.parseXml(xml, {noent: true});

        if (doc.text().includes("<!ENTITY")) {
          throw new Error("INVALID XML FILE");
        }
        
        res.send(doc.text());
    } catch (err) {
        res.send(err.toString());
        res.sendStatus(500);
    }
});