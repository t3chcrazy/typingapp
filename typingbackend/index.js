const express = require("express")
const compression = require("compression")
const { ok, match } = require("node:assert")
const bodyParser = require("body-parser")
const { initializeApp } = require("firebase-admin/app")
const { credential } = require("firebase-admin")
const { getAuth } = require("firebase-admin/auth")
const cors = require("cors")
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore")
const app = express()
const port = 3000

initializeApp({
  credential: credential.cert(require("./serviceAccountKey.json")),
  serviceAccountId: "firebase-adminsdk-ffq8y@typinggame-f2e8c.iam.gserviceaccount.com",
  databaseURL: "https://typinggame-f2e8c-default-rtdb.asia-southeast1.firebasedatabase.app"
})

const fAuth = getAuth()
const db = getFirestore()

const isValidFirebaseUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization?.split(" ")?.[1]
    if (!authHeader) {
      throw new Error("Invalid Firebase ID token")
    }
    const decodedToken = await fAuth.verifyIdToken(authHeader, true)
    if (!decodedToken.uid) {
      throw new Error("Unauthorized user")
    }
    else {
      req.uid = decodedToken.uid
      next()
    }
  }
  catch (err) {
    res.status(400).send({
      message: err.code === "auth/argument-error"? "Invalid Firebase ID Token": err.message
    })
  }
}

app.use(cors())
app.use(compression())
app.use(bodyParser.json())
app.use(isValidFirebaseUser)

app.get("/generateWords", (req, res) => {
  res.status(200).send({
    message: "hexosamine maltases glaired fawning ragingly enthronements devwsor cisrhenane buccaneerish resistably magnetolysis nonarraignment breams mesnalties enantiomorphism haemocytoblast imparities gadinic oldy redeal life tequila magnetospheric felicitousness parlesie diana tonsillectomies pennipotent shabbed strandage antiparasitically homilist whirlbone elizabethan merdivorous circumscriptions inobservantly participatively outchased tyrannise semicyclic rotatoria unstationary rejecters usques pediculofrontal semianarchism microcolumnar incontinency cuspate amicronucleate ternize consulary landhold rajbansi courtier glens mylohyoid incantations sortilegious disnatural sickless overcoloration septuplet rumpy mofussil stomate reification clavicytheria victimization steenboc cayenne yallow undisinfected overbitten untangles apomecometry milkweeds overproportion hallux seedcases hitchy quartz lotions pentastich tokodynamometer contracted butterfingers percussioner deutomala ungrantable impaneled chart deny cadillac slavers downier sticky communicate exonerative sprucify rab benefaction tampering untruth epistemophilia gobiesociform jargon toasters quinanarii farcify woodnote symptomical tristichic abasedness archbishops arrhenotokous infaunae triketo semiopen enflowering burlesqued profluvious fc enoil semivolatile besetters floerkea clogs comvia grallina uproarious buttinskies hyalts decisteres lexicographian spongiozoon connote perdendosi corypphaei meteoromancy filazer osteochondrophyte scapulary obiism ballatoon homegoer lorgnettes travelling vulcanisation afterform unrefractively stravaiger rechallenging misaverred cherubs nonsubmergence beseeming pal epiclesis wattmen wornil dialystelic photochromatic cephalacanthus awk surmounts romantics uprushed unperforating captivance phenethicillin spermic fluidization cariacus vively unconverging swoopers tutu infelicitous cadaster voltivity teniasises piltock mru stormlike larviparous untethering rawing vivant uncheerily donacidae supermoisten docimology feinted morcellated mensis withstands clinoclasite voicefulness fluidrachm unchivalrousness conocuneus willowware underdistinction formulaic molybdosis nupe endocervical chafeweed unsuccorable cipherhood jowed incognito mocker nasillate excogitator macrolepidopterous reprobatory regracy moutan urologist unfusibility intermutual antireacting peel bodger dedolency hyperrhythmical viscosities nongypsy mataco isentropically done goboes bollox soke unadhering locarnist bartered intransferrable glide xanthippe urol endarchies unfeminist abkhas geologist restionaceous romagnole netsuke nonny customizers undeparted aspergillums corsaint wholism pandle pickage uninterpretative paraesthetic remeasure vituper clumse enlivenment chukars araliaceous amyloidoses ostinatos tachinidae disputisoun untremulously imagnableness noncomical ignitability bayamos tortoni spionid microreaction flatterdock stickless cannibalistic misstarts interspacing fluidising sexfarious unstigmatic nongrievousness drawout ebbman polyarthrous unfurbelowed inspreith valencian swinishness allodies divinized underpay touchups hemerythrin"
  })
})

app.post("/saveRun", async (req, res) => {
  const uid = req.uid ?? "Hello"
  await db.collection("scores").doc(uid).set({
    ...req.body,
    createdDate: new Date()
  })
  res.send({
    message: "Successfully created!"
  })
  console.log("Successfully created!")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})