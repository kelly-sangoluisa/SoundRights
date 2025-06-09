// Entity/User.js

class User {
  constructor(id_user, name_user, email_user, password_user, security_question, security_answer) {
    this.id_user = id_user;
    this.name_user = name_user;
    this.email_user = email_user;
    this.password_user = password_user;
    this.security_question = security_question;
    this.security_answer = security_answer;
  }
}

module.exports = User;
