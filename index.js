"use strict"

var request = require('request');

class Slack {
  constructor(context, team, token) {
    this.context = context;
    if ( ! team || ! token ) { return this.error('undefined slack env'); }
    this.team = team;
    this.token = token;
    this.api_base = `https://${team}.slack.com/api`;
  }

  getInfo() {
    const params = {
      url: this.api_base + '/users.list',
      qs: {
        token: this.token,
        presence: 1,
      },
    };
    request.get(params, (err, response, body) => {
      if ( err ) { return this.error(err); }
      var info = {};
      var users = JSON.parse(body).members.filter((user) => ( ! user.is_bot && ! user.deleted ));
      info.total = users.length;
      info.online = users.filter((user) => ( user.presence === 'active' )).length;
      this.context.succeed(info);
    });
  }

  invite(email) {
    if ( ! email ) { this.errpr('undefined email'); }
    const params = {
      url: this.api_base + '/users.admin.invite',
      form: {
        email: email,
        token: this.token,
        set_active: true,
      },
    };
    request.post(params, (err, response, body) => {
      if ( err ) { return this.error(err); }
      this.context.succeed( JSON.parse(body) );
    });
  }

  error(message) {
    return this.context.fail( new Error(message) );
  }
}

exports.handler = function(event, context) {
  var slack = new Slack(context, event.slack_team, event.slack_token);
  switch ( event.action ) {
    case 'info':
      slack.getInfo();
      break;
    case 'invite':
      slack.invite(event.email);
      break;
    default:
      return context.fail( new Error('undefined action') );
  }
};
