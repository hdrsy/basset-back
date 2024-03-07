
const { ValidationError } = require('@strapi/utils').errors;
const { getUserFromJwt,checkUserContract } = require('../services/auth');

const success_status = 200;
const unauthorized_user = 401;
module.exports = {
  async getComplexOption(ctx){
    const { complex_id } = ctx.request.body;
    if (!ctx.request.body.complex_id) throw new ValidationError(' contract id id is missing');
    let complexoptions = await strapi.entityService.findMany('api::complexoption.complexoption', {
      filters:{
               id :  complex_id
          },
      fields: ['id', 'title'],
      populate: {
        complexquestions: {
          fields: ['text','type','desc'],
        },
      },
    });
    
    let answers_array = [];
    let questions_array = [];
    complexoptions.forEach(element => {            
            element.complexquestions.forEach(item => {
                let question_item= {
                  id : item.id,
                  text : item.text,
                  type:item.type,
                  desc:item.desc
              }
              questions_array.push(question_item);
          })
      });

      let data_response = {
        question : questions_array,
        // options : answers_array
      }
      const responseData = {
      data : data_response,
      statusCode: success_status,
      message: "complex"
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
                type: 16,
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
  async answerComplexQuestion(ctx){
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
                      type: 16,
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
            message: "complex successfully answered"
          }
          return responseData;          
      
  }

};
