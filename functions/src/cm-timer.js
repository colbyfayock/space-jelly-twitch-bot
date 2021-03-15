require('dotenv').config();

exports.handler = async (event, context) => {
  const { headers, body} = event;

  console.log('headers', headers)
  console.log('body', body)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: body
    })
  };
}