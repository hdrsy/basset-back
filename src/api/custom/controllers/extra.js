const { ValidationError } = require('@strapi/utils').errors;
const { getUserFromJwt,checkUserContract } = require('../services/auth');

const success_status = 200;
const unauthorized_user = 401;
module.exports = {
    async getExtraQuestion(ctx){

        const { contract_id } = ctx.request.body;
        console.log('contract_id')
        console.log(contract_id)
        // let types = strapi.query('api::type.type').find();
         // get the target answer of contract
        let target_answer = await strapi.entityService.findMany('api::answer.answer', {
          filters:{
                  type:14,
                  contract : {
                          id : contract_id
                   }
              },
        });
    
        console.log('target_answer');
        console.log(target_answer[0]);
        console.log(target_answer[0].text);
        let extras = await strapi.entityService.findMany('api::extra.extra', {
            filters:{
                     sector : {
                            id : target_answer[0].text
                     }
                },
            fields: ['text','value'],
            populate: {
                extraQuestion: {
                         fields: ['text','type','desc'],
              },
            },
          });

          
          console.log('extras');
          console.log(extras);
         
          // return types;
          let answers_array = [];
          let questions_array = [];
    
          extras.forEach(element => {
                let answer_item = {
                    id : element.id,
                    text : element.text,
                    value : element.value,
                }
                answers_array.push(answer_item);
                // element.extraQuestion.forEach(item => {
                    let question_item= {
                      id : element.extraQuestion.id,
                      text : element.extraQuestion.text,
                      type:element.extraQuestion.type,
                      desc:element.extraQuestion.desc
                  }
                  questions_array.push(question_item);
              // })
          });
    
          questions_array.forEach(element=>{
            element.options = answers_array;
        })
    
          let data_response = {
            question : questions_array,
            // options : answers_array
          }
    
          const responseData = {
          data : data_response,
          statusCode: success_status,
          message: "extras"
        }
        return responseData

    },

    // answer Extra questions
    async answerExtraQuestion(ctx){
       
            const {question_id,answer_id,contract_id } = ctx.request.body;
            if (!ctx.request.body.question_id) throw new ValidationError(' question id is missing');
            if (!ctx.request.body.answer_id) throw new ValidationError(' answer id is missing');
            if (!ctx.request.body.contract_id) throw new ValidationError(' contract id is missing');

            // check User Token
            const user = await getUserFromJwt(ctx.request.header.token);
            if(!user){
              const responseData = {
                data : '',
                statusCode: unauthorized_user,
                message: "invalid token"
              }
              return responseData
            }
            // check contract ownership
            const user_have_contract = await checkUserContract(user.id,contract_id);
            if(!user_have_contract){
              const responseData = {
                data : '',
                statusCode: unauthorized_user,
                message: "Contract Not Belong to User"
              }
              return responseData
            }

            let answers = await strapi.entityService.findMany('api::answer.answer', {
              filters:{
                      question_id : question_id,
                      type:7,
                      contract : {
                              id : contract_id
                       }
                  },
            });
        
            console.log('answers');
            console.log(answers);
        
            await answers.forEach(element => {
                strapi.entityService.delete('api::answer.answer',element.id);
            });
             
        
            await strapi.entityService.create('api::answer.answer', {
              data: {
                text:answer_id+"",
                type:7,
                question:question_id,
                contract:{
                  id:contract_id
                }
              },
            });
         
            const responseData = {
              data : "",
              statusCode: success_status,
              message: "extra successfully answered"
            }
            return responseData;  
          
        
    }
    


}