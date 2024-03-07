const { ValidationError } = require('@strapi/utils').errors;
const { getUserFromJwt,checkUserContract } = require('../services/auth');

const success_status = 200;
const unauthorized_user = 401;
module.exports = {
    async getMiddleQuestion(ctx){

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
    
        console.log('type_answer');
        console.log(target_answer[0]);
        console.log(target_answer[0].text);
         // get the middles question of specified target that answered of the contract
        let middles = await strapi.entityService.findMany('api::middle.middle', {
            filters:{
                     target : {
                            id : target_answer[0].text
                     }
                },
            fields: ['id'],
            // populate: {
            //     conditionQuestion: {
            //              fields: ['text','type'],
            //   },
            // },
          });

          
          console.log('conditions');
          console.log(middles);
         
          // return types;
          let answers_array = [];
          let questions_array = [];
    
          middles.forEach(element => {
                let answer_item = {
                    id : element.id,
                    text : element.kind,
                }
                answers_array.push(answer_item);
                // element.conditionQuestion.forEach(item => {
                //     let question_item= {
                //       id : element.conditionQuestion.id,
                //       text : element.conditionQuestion.text,
                //       type:element.conditionQuestion.type
                //   }
                //   questions_array.push(question_item);
              // })
          });
    
        //   questions_array.forEach(element=>{
        //     element.options = answers_array;
        // })
    
          let data_response = {
            question : [],
            options : answers_array
          }
    
          const responseData = {
          data : data_response,
          statusCode: success_status,
          message: "ends"
        }
        return responseData

    },

    // answer middle question
    async answerMiddleQuestion(ctx){
       
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
                      type:8,
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
                type:8,
                question:question_id,
                contract:{
                  id:contract_id
                }
              },
            });
         
            const responseData = {
              data : "",
              statusCode: success_status,
              message: "middle successfully answered"
            }
            return responseData;  
          
        
    }
    


}