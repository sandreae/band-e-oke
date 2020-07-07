// Use CommonJS require below so we can dynamically import during build-time.
if (process.env.NODE_ENV === "production") {
  module.exports = require("./configureStore.prod");
} else {
  console.log('dev with logger')
  module.exports = require("./configureStore.dev");
}
