const { ValidationError } = require('@strapi/utils').errors;
const { getUserFromJwt,checkUserContract } = require('../services/auth');

const success_status = 200;
const unauthorized_user = 401;
module.exports = {
    async getBeginQuestion(ctx){

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
        // get the begin question of specified target that answered of the contract
        let begins = await strapi.entityService.findMany('api::begin.begin', {
            filters:{
                     target : {
                            id : target_answer[0].text
                     }
                },
            fields: ['subject'],
            populate: {
                documentQuestion: {
                         fields: ['text','type','desc'],
              },
            },
          });

          
          console.log('begins');
          console.log(begins);
         
          // return types;
          let answers_array = [];
          let questions_array = [];
    
          // build the response across all result 
          begins.forEach(element => {
                let answer_item = {
                    id : element.id,
                    text : element.subject,
                }
                answers_array.push(answer_item);
                element.documentQuestion.forEach(item => {
                    let question_item= {
                      id : item.id,
                      text : item.text,
                      type:item.type,
                      desc:item.desc
                  }
                  questions_array.push(question_item);
              })
          });
    
        //   questions_array.forEach(element=>{
        //     element.options = answers_array;
        // })
    
          let data_response = {
            question : questions_array,
            // options : answers_array
          }
    
          const responseData = {
          data : data_response,
          statusCode: success_status,
          message: "begins"
        }
        return responseData

    },

    // delete old answers for same contract 
    async deleteAnswers(answer_array,contract_id) {
      // First loop to fetch and delete all old answers for each question
      for (let element of answer_array) {
  
          // Fetch the old answers
          let answers = await strapi.entityService.findMany('api::answer.answer', {
              filters: {
                  question_id: element.question_id,
                  type: 5,
                  contract: {
                      id: contract_id
                  }
              },
          });
          
          console.log('answers');
          console.log(answers);
          
          // Delete old answers for the current question
          for (let item of answers) {
              await strapi.entityService.delete('api::answer.answer', item.id);
          }
      }
  },

  // answer begin question 
    async answerBeginQuestion(ctx){
       
            const {answer_array,contract_id } = ctx.request.body;
            // if (!ctx.request.body.question_id) throw new ValidationError(' question id is missing');
            // if (!ctx.request.body.answer_id) throw new ValidationError(' answer id is missing');
            if (!ctx.request.body.answer_array) throw new ValidationError(' answer array is missing');
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

            // delete old answers
            await this.deleteAnswers(answer_array,contract_id);

            // insert record for every question's answer
            for (let element of answer_array) {
              console.log('element.question_id');
              console.log(element.question_id);
              await strapi.entityService.create('api::answer.answer', {
                  data: {
                      text: element.answer + "",
                      type: 5,
                      question: element.question_id,
                      contract: {
                          id: contract_id
                      }
                  },
              });
          }
            const responseData = {
              data : "",
              statusCode: success_status,
              message: "begin successfully answered"
            }
            return responseData;  
          
        
    }
    


}