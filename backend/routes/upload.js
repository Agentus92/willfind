const router = require("express").Router();
const path = require("path");
const Poteryash = require("../models/poteryashSchema");
const User = require("../models/userSchema");

const fs = require("fs");

router.post("/", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file was uploaded" });
  }
  const file = req.files.file;
  file.mv(path.join(__dirname, `../../public/uploads/${file.name}`), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});
const getAges = (year) => {
  if (year) return new Date().getFullYear() - Number(year);
};

router.post("/missedperson", async (req, res) => {
  console.log("ya tut");
  try {
    const fio = req.body.name.split(" ");
    const firstName = fio[1];
    const middleName = fio[2];
    const lastName = fio[0];
    const ages = getAges(String(req.body.birthday).slice(0, 4));
    const author = await User.findById(req.body.author);
    // console.log(req.body.url);
    const poteryash = await new Poteryash({
      authorName: req.body.authorName,
      authorTel: req.body.authorTel,
      firstName,
      lastName,
      middleName,
      specificMarks: req.body.specificMarks,
      terrain: req.body.terrain,
      sex: req.body.gender,
      more: req.body.more,
      birthDate: req.body.birthday,
      addressOfLost: req.body.addressOfLost,
      timeOfLost: req.body.time,
      aboutOfLost: req.body.description,
      health: req.body.health,
      clothes: req.body.clothes,
      SpecialSigns: req.body.specificMarks,
      thingsWith: req.body.stuff,
      image: req.body.img,
      createdAt: new Date(),
      ages,
      author,
    });
    await poteryash.save();
    author.searching.push(poteryash);
    await author.save();
    res.json(poteryash);
  } catch (e) {
    // console.error(e.message);
    return res.status(500).send(e);
  }
});

router.post("/missedpersonOne", async (req, res) => {
  const user = await Poteryash.findById(req.body.id);
  res.json(user);
});

router.get("/missedpeople", async (req, res) => {
  try {
    let ppl = await Poteryash.find();
    // console.log(ppl);
    res.json({ ppl });
  } catch (e) {
    res.status(500).json(e);
  }
});

router.patch("/coordinates", async (req, res) => {
  try {
    const poteryash = await Poteryash.findById(req.body.id);
    poteryash.coordinates = req.body.coordinates;
    await poteryash.save();
    // console.log(poteryash);
    res.json(poteryash);
  } catch (e) {
    // console.error(e.message);
    res.json(e);
  }
});

router.get("/countcoordinates/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    // console.log(user)
    const userCoordinates = [
      Number(user.coordinates[0]),
      Number(user.coordinates[1]),
    ];

    const sumUserCoordinates = userCoordinates[0] + userCoordinates[1];
    let poteryashes = await Poteryash.find();
    poteryashes.forEach(p => p.sumCoordinates = Number(p.coordinates[0]) + Number(p.coordinates[1]))

  
    const func2 = (number, arr) => {
      return arr.filter(item => (item - number) <= 0.1)
  }

  
    const coordinates = poteryashes.map(
      (p) => Number(p.coordinates[0]) + Number(p.coordinates[1])
    );
    const result = coordinates.filter((el) => Math.abs(el - sumUserCoordinates < 0.1));
      // console.log(result)
    
      const nashel = poteryashes.filter(p => p.sumCoordinates === result[0])
    
      // const nashel = poteryashes.filter(p => func2(p.sumCoordinates, result))
    res.json(nashel)
    
    //  poteryashes.map(p => p.coordinates.forEach(e =>  result.push(Number(e))));
    // console.log(result)
    // console.log(res);
    // const xy =  matches.forEach(Number(e) => e.reduce((sum, current) => {
    //    return sum + current;
    //   }, 0))
    //  console.log(xy)
    // console.log(matches);
    // Math.abs(Number(el) - (userCoordinates[0] + userCoordinates[1])) < 1
    // )

    // el.reduce((sum, current) => {
    //   return sum + current;
    // }, 0)))
  } catch (e) {
    res.json(e);
  }
});
module.exports = router;

// const poteryashSchema = new mongoose.Schema({
//   firstName: { type: String },
//   lastName: { type: String },
//   middleName: { type: String },
//   sex: { type: String},
//   birthDate: { type: Date },
//   addressOfLost: { type: String },
//   timeOfLost: { type: String },
//   aboutOfLost: { type: String },
//   health: { type: String },
//   clothes: { type: String },
//   specialSigns: { type: String},
//   thingsWith: { type: String},
//   image: { type: String, default: 'http://localhost:3000/no-photo.jpg' },
//   description: { type: String},
//   createdAt: { type: Date, required: true },
//   foundAt: { type: Date},
//   foundLocationX: { type: String },
//   foundLocationY: { type: String },
// });
