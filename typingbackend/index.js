const express = require("express")
const compression = require("compression")
const bodyParser = require("body-parser")
const { initializeApp } = require("firebase-admin/app")
const { credential } = require("firebase-admin")
const { getAuth } = require("firebase-admin/auth")
const cors = require("cors")
const { getFirestore } = require("firebase-admin/firestore")
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
      throw new Error("Invalid ID token")
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
    message: ['song', 'head', 'got', 'want', 'idea', 'these', 'thought', 'add', 'world', 'follow', 'river', 'away', 'until', 'so', 'always', 'picture', 'it', 'city', 'without', 'take', 'he', 'people', 'day', 'could', 'how', 'way', 'white', 'state', 'feet', 'if', 'this', 'work', 'came', 'night', 'walk', 'get', 'hand', 'high', 'three', 'open', 'group', 'learn', 'America', 'much', 'idea', 'find', 'new', 'there', 'any', 'down', 'good', 'try', 'different', 'its', 'paper', 'took', 'come', 'kind', 'through', 'can', 'even', 'big', 'me', 'is', 'up', 'help', 'found', 'along', 'without', 'same', 'many', 'point', 'hand', 'once', 'his', 'almost', 'sea', 'point', 'mountain', 'him', 'through', 'change', 'car', 'the', 'with', 'your', 'has', 'we', 'plant', 'out', 'must', 'good', 'while', 'took', 'another', 'country', 'animal', 'many', 'quickly', 'almost', 'should', 'more', 'take', 'how', 'often', 'being', 'well', 'turn', 'leave', 'both', 'each', 'first', 'list', 'here', 'other', 'quick', 'was', 'sound', 'even', 'grow', 'picture', 'no', 'when', 'stop', 'man', 'other', 'him', 'day', 'under', 'earth', 'group', 'us', 'question', 'as', 'always', 'year', 'only', 'she', 'light', 'idea', 'left', 'here', 'read', 'two', 'should', 'little', 'is', 'children', 'add', 'house', 'tell', 'those', 'have', 'girl', 'stop', 'than', 'work', 'began', 'something', 'as', 'their', 'long', 'paper', 'from', 'do', 'sea', 'help', 'song', 'ask', 'same', 'cut', 'tell', 'call', 'would', 'watch', 'every', 'where', 'enough', 'had', 'new', 'those', 'make', 'new', 'side', 'near', 'and', 'what', 'end', 'sometimes', 'from', 'us', 'was', 'more', 'different', 'off', 'it', 'want', 'last', 'how', 'quickly', 'little', 'seem', 'few', 'own', 'at', 'too', 'talk', 'are', 'their', 'make', 'long', 'just', 'world', 'make', 'earth', 'went', 'feet', 'only', 'call', 'world', 'between', 'until', 'often', 'old', 'still', 'end', 'before', 'men', 'right', 'his', 'mother', 'watch', 'there', 'life', 'list', 'story', 'go', 'this', 'thought', 'know', 'answer', 'came', 'try', 'would', 'near', 'all', 'after', 'move', 'down', 'made', 'book', 'both', 'live', 'to', 'then', 'name', 'light', 'because', 'great', 'tree', 'time', 'think', 'the', 'oil', 'this', 'find', 'you', 'into', 'large', 'second', 'life', 'more', 'between', 'mile', 'important', 'car', 'about', 'under', 'he', 'change', 'began', 'start', 'animal', 'small', 'country', 'run', 'again', 'before', 'quite', 'white', 'book', 'carry', 'them', 'these', 'open', 'talk', 'such', 'are', 'page', 'then', 'face', 'oil', 'place', 'set', 'far', 'let', 'another', 'always', 'now', 'page', "don't", 'use', 'start', 'study', 'cut', 'good', 'who', 'many', 'keep', 'again', 'live', 'them', 'close', 'same', 'never', 'live', "don't", 'large', 'you', 'also', 'saw', 'look', 'Indian', 'light', 'could', 'him', 'also', 'those', 'father', 'together', 'plant', 'tell', 'then', 'turn', 'here', 'one', 'need', 'still', 'went', 'help', 'than', 'out', 'get', 'play', 'air', 'long', 'too', 'river', 'learn', 'so', 'got', 'letter', 'sound', 'be', 'once', 'number', 'not', 'most', 'their', 'mile', 'hard', 'boy', 'said', 'when', 'off', 'big', 'number', 'm']
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