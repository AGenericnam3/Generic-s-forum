const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// Holds all the existing users
const users = [];
// Generate a random string as ID
const generateID = () => Math.random().toString(36).substring(2, 10);
// Holds all of the created posts
const threadList = [];
const Users = firebase
.firestore()
.collection(Users)
.doc("JKINNT7IlblsN3IS3spF")
.set({
    created: firebase.firestore.FieldValue.serverTimestamp(),
  })
  .then(() => {
    console.log("Added user");
  });

app.get("/",(req, res) =>{
    res.render("index.html");
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.post("/api/register", async (req, res) => {
    const { email, password, username } = req.body;
    const id = generateID();
    // Ensures there is no existing user with the same credentials
    const result = users.filter(
        (user) => user.email === email && user.password === password
    );
    if (result.length === 0) {
        const newUser = { id, email, password, username };
        // Add the user to the database (array)
        users.push(newUser);
        // Return a success message
        return res.json({
            message: "Account created successfully!",
        });
    }
    // If there is an existing user
    res.json({
        error_message: "User already exists",
    });
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    // Check if the user exists
    let result = users.filter(
        (user) => user.email === email && user.password === password
    );
    // If the user doesn't exist
    if (result.length !== 1) {
        return res.json({
            error_message: "Incorrect credentials",
        });
    }
    // Return the id if successfuly logged in
    res.json({
        message: "Login successfully",
        id: result[0].id,
    });
});

app.post("/api/create/thread", async (req, res) => {
    const { thread, userId } = req.body;
    const threadId = generateID();
    
    // Add post details to the array
    threadList.unshift({
        id: threadId,
        title: thread,
        userId,
        replies: [],
        likes: [],
    });
    
    // Return a response containing the posts
    res.json({
        message: "Thread created successfully.",
        threads: threadList,
    });
});

app.get("/api/all/threads", (req, res) => {
    res.json({
        threads: threadList,
    });
});

app.post("/api/thread/like", (req, res) => {
    // Accept the post id and the user id
    const { threadId, userId } = req.body;
    // Get the reacted post
    const result = threadList.filter((thread) => thread.id === threadId);
    // Get the likes property
    const threadLikes = result[0].likes;
    // Authenticate the reaction
    const authenticateReaction = threadLikes.filter((user) => user === userId);
    // Adds the user to the likes array
    if (authenticateReaction.length === 0) {
        threadLikes.push(userId);
        return res.json({
           message: "You've reacted to the post.",
        });
    }
    // Return an error that the user has reacted to the post already
    res.json({
        error_message: "You can only react once!",
    });
});

app.post("/api/thread/replies", (req, res) => {
    // The post ID
    const { id } = req.body;
    // Search for the post
    const result = threadList.filter((thread) => thread.id === id);
    // Return the title and replies
    res.json({
        replies: result[0].replies,
        title: result[0].title,
    });
});

app.post("/api/create/reply", async (req, res) => {
    // Accepts the post id, user id, and reply
    const { id, userId, reply } = req.body;
    // Search for the exact post that was replied to
    const result = threadList.filter((thread) => thread.id === id);
    // Search for the user via its id
    const user = users.filter((user) => user.id === userId);
    // Saves the user name and reply
    result[0].replies.unshift({
        userId: user[0].id,
        name: user[0].username,
        text: reply,
    });

    res.json({
        message: "Response added successfully.",
    });
});

Users
    .get()
    .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("All data in 'Users' collection", data); 
      });

Users.get().then((doc) => {
  if (!doc.exists) return;
  console.log("Document data:", doc.data());
});