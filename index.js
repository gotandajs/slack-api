var https = require('https');

exports.handler = function(event, context) {

  if ( ! event.slack_team || ! event.slack_token ) {
    context.fail(new Error('undefined slack env'));
    return;
  }
  var url = 'https://' + event.slack_team + '.slack.com/api/users.list?presence=1&token=' + event.slack_token;

  https.get(url, function(res) {
    var body = '';
    res.on('data', function(chunk){ body += chunk; });
    res.on('end', function(res){
      var info = {};
      var json = JSON.parse(body);
      var users = json.members.filter(function(user) { return ! user.is_bot && ! user.deleted; });
      info.total = users.length;
      info.online = users.filter(function(user) { return user.presence === 'active'; }).length;
      context.succeed(info);
    });
  });
};
