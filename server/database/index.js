/* eslint-disable no-console */

require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');

const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

// const { CommentSchema, Comment }  = require('./Comment');
// const { EvidenceSchema, Evidence } = require('./Evidence');

const mongoUri = 'mongodb://localhost:27017/Hash51';

const db = mongoose.connection;

// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
  // eslint-disable-next-line no-console
  console.log('Database Connection');
});

// const { Tasks } = require('./db');
// const { Video, Image } = require('./database');

// Create a mongoose connection to out mongo database
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});

const userSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  googleId: {
    type: String,
    unique: true
  },
  profileImage: String,
  source: String,
  coConspirators: [String],
  favorites: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evidence'
  },
  comments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// eslint-disable-next-line new-cap
const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/login',
  // userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
  // proxy: true,
}, (accessToken, refreshToken, profile, cb) => {
  // eslint-disable-next-line no-console
  console.log('within auth');
  console.log(profile);
  // we can use plain mongoose to satisfy this query as well.
  User.findOrCreate(
    { googleId: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
      profileImage: profile.photos[0].value,
      source: profile.provider
    }, (err, user) => cb(err, user)
  );
}
));



module.exports = { User };
