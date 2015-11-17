var request = require('request');

var api_base;

exports.handler = function(event, context) {
  if ( ! event.slack_team || ! event.slack_token ) {
    context.fail(new Error('undefined slack env'));
    return;
  }
  api_base = 'https://' + event.slack_team + '.slack.com/api';

  switch ( event.method ) {
    case 'GET':  get(event, context);  break;
    case 'POST': post(event, context); break;
  }
};

function get(event, context) {
  var params = {
    url: api_base + '/users.list',
    qs: {
      token: event.slack_token,
      presence: 1,
    },
  };
  request.get(params, function(err, response, body) {
    var info = {};
    var json = JSON.parse(body);
    var users = json.members.filter(function(user) { return ! user.is_bot && ! user.deleted; });
    info.total = users.length;
    info.online = users.filter(function(user) { return user.presence === 'active'; }).length;
    context.succeed(info);
  });
}

function post(event, context) {
}
