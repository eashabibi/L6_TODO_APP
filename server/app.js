/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */

const express = require("express");
const csrf = require("csurf");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const { User, Sport, Session, Team, Player } = require("./models");
const passport = require("passport");
const session = require("express-session");
const connectEnsureLogin = require("connect-ensure-login");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const csrfProtection = csrf({ cookie: true });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieparser());

app.use(
  session({
    secret: "my-super-secret-key-21728172615261562",
    cookie: { maxAge: 3600000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { email: username } });
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get("/get-csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post("/signup", csrfProtection, async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  if (name.length < 3) {
    return res
      .status(400)
      .json({ message: "Name must be at least 3 characters long" });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  try {
    const findUser = await User.findOne({ where: { email } });
    if (findUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }
      return res.status(200).json(user);
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", csrfProtection, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }
      return res.status(200).json(user);
    });
  })(req, res, next);
});

app.post("/check-admin", csrfProtection, async (req, res) => {
  try {
    const adminData = await User.checkAdmin(req.body.email);
    res.status(200).json(adminData);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/create-sport", csrfProtection, async (req, res) => {
  try {
    const sport = await Sport.createSport(req.body.s_name, req.body.adminId);
    res.status(200).json(sport);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/get-sports", csrfProtection, async (req, res) => {
  try {
    const sports = await Sport.getSports();
    res.status(200).json(sports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/delete-sport/:id", csrfProtection, async (req, res) => {
  try {
    const sport = await Sport.deleteSport(req.params.id);
    res.status(200).json(sport);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/get-sport/:id", csrfProtection, async (req, res) => {
  try {
    const sport = await Sport.getSportById(req.params.id);
    res.status(200).json(sport);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/create-session", csrfProtection, async (req, res) => {
  try {
    const session = await Session.createSession(
      req.body.sess_name,
      req.body.s_id,
      req.body.userId,
      req.body.date,
      req.body.start_time,
      req.body.end_time,
      req.body.venue
    );
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/get-sessions-by-sport-id/:id", csrfProtection, async (req, res) => {
  try {
    const sessions = await Session.getSessionsBySportId(req.params.id);
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get(
  "/get-session-by-id-and-sport-id/:id/:s_id",
  csrfProtection,
  async (req, res) => {
    try {
      const session = await Session.getSessionByIdandSportId(
        req.params.id,
        req.params.s_id
      );
      res.status(200).json(session);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.post("/create-team", csrfProtection, async (req, res) => {
  try {
    const team = await Team.createTeam(
      req.body.t_name,
      req.body.t_size,
      req.body.sess_id
    );
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/get-teams-by-session-id/:id", csrfProtection, async (req, res) => {
  try {
    const teams = await Team.getTeamsBySessionId(req.params.id);
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/get-team-by-id/:id", csrfProtection, async (req, res) => {
  try {
    const team = await Team.getTeamById(req.params.id);
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/create-player", csrfProtection, async (req, res) => {
  try {
    // check already exist or not by team id and player name
    const playerExist = await Player.checkPlayerExist(
      req.body.t_id,
      req.body.p_name
    );
    if (playerExist) {
      return res.status(400).json({ message: "Player already exists" });
    }
    const player = await Player.createPlayer(req.body.t_id, req.body.p_name);
    res.status(200).json(player);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/create-group-of-players", csrfProtection, async (req, res) => {
  try {
    const filterPlayers = req.body.players.filter((p) => p.length > 0);

    const players = await Player.createGroupOfPlayers(
      req.body.t_id,
      filterPlayers
    );
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/get-players-by-team-id/:id", csrfProtection, async (req, res) => {
  try {
    const players = await Player.getPlayersByTeamId(req.params.id);
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/count-players-by-team-id/:id", csrfProtection, async (req, res) => {
  try {
    const players = await Player.countPlayersByTeamId(req.params.id);
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = app;
