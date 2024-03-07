const { ValidationError } = require('@strapi/utils').errors;
module.exports = {
    async getUserFromJwt(jwt) {
        try {
            const { id } = await strapi.plugins['users-permissions'].services.jwt.verify(jwt);
            const user =  await strapi.query("plugin::users-permissions.user").findOne({
              where: { id }
            });
          return user;
        } catch (err) {
          return  null;
        }
      },
      async checkUserContract(user_id,contract_id) {
        try {
          const contracts = await strapi.entityService.findMany('api::contract.contract', {
            filters:{
                    id:contract_id,
                    users_permissions_user : {
                            id : user_id
                     }
                },
              });
              if (contracts.length > 0) {
                return true;
              }else{
                return false;
              }
          
        } catch (err) {
          return  null;
        }
      },
  };