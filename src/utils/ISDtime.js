const getISTTime = () => {
  const now = new Date();
  const ISTOffset = 5.5 * 60 * 60 * 1000; 
  return new Date(now.getTime() + ISTOffset);
};

// const getISTTime = () => {
//   return new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
// };

module.exports = { getISTTime };
