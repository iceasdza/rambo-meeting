var app = require("express")();
var http = require("http").createServer(app);
var moment = require("moment");
const end = moment(1609434001000);

const numberFormatter = (number) => {
  return ("0" + number).slice(-2);
};

app.get("/test", (req, res) => {
  res.send("HELLO");
});

var io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", (e) => {
    console.log("USER DISCONNECTED");
  });

  socket.on("setName", (e) => {
    io.emit("notice", {
      type: "login",
      message: `${e.name} has joined`,
      name: e.name,
      position: e.data,
      id: e.data.id,
    });
  });

  setInterval(() => {
    const start = moment(Date.now()); // another date
    const isNewYear = end.diff(start, "seconds") <= 0;
    io.emit("time", {
      hours: end.diff(start, "hours"),
      minute: numberFormatter(end.diff(start, "minutes") % 60),
      second: numberFormatter(end.diff(start, "seconds") % 60),
      isNewYear,
    });
  }, 1000);

  socket.on("setUserPosition", (e) => {
    io.emit("userMove", e);
  });

  socket.on("setMessage", (e) => {
    // wish.push(e.message);
    io.emit("getMessage", e);
  });
});

http.listen(3030, () => {
  console.log("listening on *:3030");
});
