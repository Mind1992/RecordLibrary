var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RecordSchema = new Schema({
  _id: Number,
  title: String,
  genres: [String],
  styles: [String],
  artists: [{join: String, name: String}],
  year: String,
  images: String,
  tracklist: [{ preview_url: Array, duration: String, position: String, type_: String, title: String }]
});

mongoose.model('Record', RecordSchema);
