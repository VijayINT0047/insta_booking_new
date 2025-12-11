const getISTTime = require("../utils/getISTTime");

function applyTimestamps(schema) {
  
  // For .save()
  schema.pre("save", function (next) {
    const now = getISTTime();

    if (this.isNew) {
      this.createdAt = now;
    }
    this.updatedAt = now;

    next();
  });

  // For findOneAndUpdate()
  schema.pre("findOneAndUpdate", function (next) {
    const now = getISTTime();
    this.set({ updatedAt: now });
    next();
  });

  // For updateOne()
  schema.pre("updateOne", function (next) {
    const now = getISTTime();
    this.set({ updatedAt: now });
    next();
  });
}

module.exports = applyTimestamps;
