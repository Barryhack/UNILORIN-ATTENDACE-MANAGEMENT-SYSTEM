// A simple function to test Netlify Functions
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from UNILORIN AMS API!" })
  };
}; 