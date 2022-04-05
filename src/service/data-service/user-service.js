"use strict";

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async findByEmail(email) {
    const user = await this._User.findOne({where: {email}});
    return user && user.get();
  }

  async create(userData) {
    const count = await this._User.count();

    const isFirstUser = !count;

    const user = await this._User.create({
      ...userData,
      isAdmin: isFirstUser
    });

    return user.get();
  }
}

module.exports = UserService;
