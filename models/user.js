class User{
    constructor(userId, username, email, password, roles){
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }
}

exports.User = User;