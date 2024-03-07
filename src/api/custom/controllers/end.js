const { ValidationError } = require('@strapi/utils').errors;
const { getUserFromJwt,checkUserContract } = require('../services/auth');

const success_status = 200;
const unauthorized_user = 401;
module.exports = {
    async getEndQuestion(ctx){

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
        let conditions = await strapi.entityService.findMany('api::condition.condition', {
            filters:{
                     target : {
                            id : target_answer[0].text
                     }
                },
            fields: ['text'],
            populate: {
                conditionQuestion: {
                         fields: ['text','type','desc'],
              },
            },
          });

          
          console.log('conditions');
          console.log(conditions);
         
          // return types;
          let answers_array = [];
          let questions_array = [];
    
          conditions.forEach(element => {
            if(element.conditionQuestion){
              let question_item= {
                id : element.conditionQuestion.id,
                text : element.conditionQuestion.text,
                type:element.conditionQuestion.type,
                desc:element.text,
                options:[]
            }
            // questions_array.push(question_item);
                // let answer_item = {
                //     id : element.id,
                //     text : element.text,
                //     type:"end",
                //     options:[question_item]
                // }
                answers_array.push(question_item);
                // element.conditionQuestion.forEach(item => {
                
                }
              // })
          });
    
        //   questions_array.forEach(element=>{
        //     element.options = answers_array;
        // })
    
          let data_response = {
            question : answers_array,
            // options : answers_array
          }
    
          const responseData = {
          data : data_response,
          statusCode: success_status,
          message: "ends"
        }
        return responseData

    },
     // get the next condition question for specific question
    async getNextEndQuestion(ctx){

      const { contract_id,question_id } = ctx.request.body;
      let target_answer = await strapi.entityService.findMany('api::answer.answer', {
        filters:{
                type:14,
                contract : {
                        id : contract_id
                 }
            },
      });
      let conditions = await strapi.entityService.findMany('api::condition.condition', {
          filters:{
                   target : {
                          id : target_answer[0].text
                   }
              },
          fields: ['text'],
          sort: {id: 'ASC'},
          populate: {
              conditionQuestion: {
                       fields: ['text','type','desc'],
            },
          },
        });
        let result = [];
        conditions.forEach(condition => {
          if(condition.conditionQuestion && condition.conditionQuestion.id > question_id){
               result.push(condition);
          }
        });
       
        console.log('after conditions');
        console.log(result);
        // return types;
        let answers_array = [];
        let questions_array = [];
        if(result.length > 0){
          let first = result[0];
                if(first.conditionQuestion){
                  let question_item= {
                    id : first.conditionQuestion.id,
                    text : first.conditionQuestion.text,
                    type:first.conditionQuestion.type,
                    desc:first.text,
                    options:[]
                }
                answers_array.push(question_item);
                
              }
         
        }
      
  
        let data_response = {
          question : answers_array,
          // options : answers_array
        }
  
        const responseData = {
        data : data_response,
        statusCode: success_status,
        message: "ends"
      }
      return responseData

  },

  // delete  old question's answers
    async deleteAnswers(answer_array,contract_id) {
      // First loop to fetch and delete all old answers for each question
      for (let element of answer_array) {
  
          // Fetch the old answers
          let answers = await strapi.entityService.findMany('api::answer.answer', {
              filters: {
                  question_id: element.question_id,
                  type: 6,
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
  // answer for end questions
    async answerEndQuestion(ctx){
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


              for (let element of answer_array) {
                console.log('element.question_id');
                console.log(element.question_id);
                await strapi.entityService.create('api::answer.answer', {
                    data: {
                        text: element.answer + "",
                        type: 6,
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
              message: "end successfully answered"
            }
            return responseData;  
      
            // const {question_id,answer_id,contract_id } = ctx.request.body;
            // if (!ctx.request.body.question_id) throw new ValidationError(' question id is missing');
            // if (!ctx.request.body.answer_id) throw new ValidationError(' answer id is missing');
            // if (!ctx.request.body.contract_id) throw new ValidationError(' contract id is missing');

            // // check User Token
            // const user = await getUserFromJwt(ctx.request.header.token);
            // if(!user){
            //   const responseData = {
            //     data : '',
            //     statusCode: unauthorized_user,
            //     message: "invalid token"
            //   }
            //   return responseData
            // }
            // // check contract ownership
            // const user_have_contract = await checkUserContract(user.id,contract_id);
            // if(!user_have_contract){
            //   const responseData = {
            //     data : '',
            //     statusCode: unauthorized_user,
            //     message: "Contract Not Belong to User"
            //   }
            //   return responseData
            // }

            // let answers = await strapi.entityService.findMany('api::answer.answer', {
            //   filters:{
            //           question_id : question_id,
            //           type:6,
            //           contract : {
            //                   id : contract_id
            //            }
            //       },
            // });
        
            // console.log('answers');
            // console.log(answers);
        
            // await answers.forEach(element => {
            //     strapi.entityService.delete('api::answer.answer',element.id);
            // });
        
            // await strapi.entityService.create('api::answer.answer', {
            //   data: {
            //     text:answer_id+"",
            //     type:6,
            //     question:question_id,
            //     contract:{
            //       id:contract_id
            //     }
            //   },
            // });
         
            // const responseData = {
            //   data : "",
            //   statusCode: success_status,
            //   message: "end successfully answered"
            // }
            // return responseData;  
          
        
    }
    


}