
const { ValidationError } = require('@strapi/utils').errors;
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const crypto = require('crypto');
const { getUserFromJwt } = require('../services/auth');
var bcrypt = require('bcryptjs');


const success_status = 200;
const unauthorized_user = 401;

module.exports = {

  async registerByPhone(ctx) {
    const { email,username,phoneNumber, password,gender,city } = ctx.request.body;
  
    // Validate phone number
    // const phone = parsePhoneNumberFromString(phoneNumber);
    // if (!phone || !phone.isValid()) {
    //   return ctx.throw(400, "Invalid phone number");
    // }
  
    // Check if user with phone number already exists
    let existingUsers =  await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: {
        phoneNumber : phoneNumber
      },
    });
    if (existingUsers[0]) {
      return ctx.throw(400, "Phone number already in use");
    }
  
    // Register the user
    const user = await strapi.plugins['users-permissions'].services.user.add({
      email,username,
      phoneNumber,
      password,
      gender,
      city
    });
  
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
      id: user.id
    });
  
    ctx.send({
      jwt,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber
      }
    });
  },

  async login(ctx) {
    const { phoneNumber, password } = ctx.request.body;
  
    // const user = await strapi.plugins['users-permissions'].services.user.fetch({
    //   phoneNumber
    // });
    // const user = await strapi.query('plugin::users-permissions.user').findOne({ phoneNumber });

    let user =  await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: {
        phoneNumber : phoneNumber
      },
    });
      
    if (!user[0]) {
      return ctx.throw(400, "User not found");
    }
    
    user = user[0];
    const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(password, user.password);
    
    if (!validPassword) {
      return ctx.throw(400, "Invalid password");
    }
  
    const token = strapi.plugins['users-permissions'].services.jwt.issue({
      id: user.id
    });
  
    console.log('user');
    console.log(user)

    // id: 2,
  // username: 'alex',
  // email: 'alex@gmail.com',
  // provider: 'local',
  // password: '$2a$10$iqSo0f63B/BXa1cb9z4nZOLRZrnUT18W3udFTdU1l/N9Jbpxxzrwu',
  // resetPasswordToken: null,
  // confirmationToken: null,
  // confirmed: true,
  // blocked: false,
  // createdAt: '2023-08-06T09:14:32.910Z',
  // updatedAt: '2023-08-30T07:45:56.004Z',
  // phoneNumber: '0988742931'
    ctx.send({
      token,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        username: user.username,
        email:user.email,
        gender:user.gender,
        city:user.city
      }
    });
  },


  async changePassword(ctx) {
    
    const { oldPassword, newPassword } = ctx.request.body;

    if (!oldPassword || !newPassword) {
      ctx.throw(400, 'Old password and new password are required');
    }

    try {
      const user = await getUserFromJwt(ctx.request.header.token);
      console.log('user');
      console.log(user);
      if(!user){
        const responseData = {
          data : '',
          statusCode: unauthorized_user,
          message: "invalid token"
        }
        return responseData
      }
      const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(oldPassword, user.password);

      if (!validPassword) {
        ctx.throw(401, 'Old password is incorrect');
      }

      // const hashedPassword = await strapi.plugins['users-permissions'].services.user.hashPassword(newPassword);
      // await strapi.query('user', 'users-permissions').update({ id }, { password: hashedPassword });
      const password = bcrypt.hashSync(newPassword);

      await strapi.query("plugin::users-permissions.user").update({
        where: { id: user.id },
        data: { resetPasswordToken: null, password },
      });
      const responseData = {
        data : '',
        statusCode: success_status,
        message: "Password changed successfully"
      }
      return responseData

    } catch (err) {
      console.log('err');
      console.log(err);
      ctx.throw(401, 'oops. failed to change password');
    }

  },

    // async login(ctx) {
    //     try {
    //       const { identifier, password } = ctx.request.body;
    //       const ip = ctx.request.ip;
    //       const user = await strapi.entityService('plugin::users-permissions.user').findOne({
    //         // where: {
                 
    //         //         // username: identifier ,
    //         //         phone: identifier , // << Change to your field name!
    //         //       }
    //       });

    //       // let jwt = await strapi.plugins['users-permissions'].services.jwt.issue({
    //       //   id: user_id
    //       // })

    //       return user;
    //     } catch (error) {
    //       return ctx.send({ error: 'Authentication failed' }, 401);
    //     }
    //   },

  }