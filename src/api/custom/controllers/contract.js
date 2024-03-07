const { ValidationError } = require('@strapi/utils').errors;
const { getUserFromJwt,checkUserContract } = require('../services/auth');

const success_status = 200;
const unauthorized_user = 401;
module.exports = {
    async createContract(ctx){
      const user = await getUserFromJwt(ctx.request.header.token);
      if(!user){
        const responseData = {
          data : '',
          statusCode: unauthorized_user,
          message: "invalid token"
        }
        return responseData
      }
        let contract = await strapi.entityService.create('api::contract.contract', {
            data: {
              status:"draft",
              users_permissions_user:user.id,
            },
          });
          const responseData = {
            data : {
                contract_id:contract.id
            },
            statusCode: success_status,
            message: "contract"
          }
          return responseData

    },
    async getMyContracts(ctx){
      const user = await getUserFromJwt(ctx.request.header.token);
      if(!user){
        const responseData = {
          data : '',
          statusCode: unauthorized_user,
          message: "invalid token"
        }
        return responseData
      }

            const contracts = await strapi.entityService.findMany('api::contract.contract', {
              fields: ['id', 'created_at'],
              filters: {
                  users_permissions_user: {
                      id: user.id
                  }
              },
              sort: {id: 'DESC'}
          });

          let result = [];
          for (let element of contracts) {
            let type,sector,target = '';
            let contract_id = element.id;
            let type_answers = await strapi.entityService.findMany('api::answer.answer', {
              filters:{
                      type:1,
                      contract : {
                              id : contract_id
                       }
                  },
            });
           
          if(type_answers.length > 0){
              let types = await strapi.entityService.findMany('api::type.type', {
                filters:{
                      id: type_answers[0].text
                    },
              });
            
              type = types.length > 0 ? types[0].name  : "";
          
          }
      
          let Sector_answers = await strapi.entityService.findMany('api::answer.answer', {
              filters:{
                      type:2,
                      contract : {
                              id : contract_id
                       }
                  },
            });
            if(Sector_answers.length > 0){
            let sectors = await strapi.entityService.findMany('api::sector.sector', {
              filters:{
                     id: Sector_answers[0].text
                  },
            });
            sector = sectors.length > 0 ? sectors[0].name  : "";
          }
           
          
          let target_answers = await strapi.entityService.findMany('api::answer.answer', {
              filters:{
                      type:14,
                      contract : {
                              id : contract_id
                       }
                  },
            });
            if(target_answers.length > 0){
              let targets = await strapi.entityService.findMany('api::target.target', {
                filters:{
                      id: target_answers[0].text
                    },
              });
              target = targets.length > 0 ? targets[0].title  : "";
          }

          element.title = type+" "+sector+" "+ target;

          // get max type answer 
          let max_type_results = await strapi.entityService.findMany('api::answer.answer', {
            fields:['type'],
            filters:{
                    contract : {
                            id : contract_id
                     }
                },
                sort: {type: 'DESC'}
          });
          
          if (max_type_results && max_type_results.length) {
             element.last_part = max_type_results[0].type;
          }else{
            element.last_part = 0;
          }

          if(element.last_part==15){
            element.status= 'Completed';
          }else{
            element.status = 'Draft';
          }
          result.push(element);

          };


          const responseData = {
            data : {
                contracts:result
            },
            statusCode: success_status,
            message: "contract"
          }
          return responseData

    }


}