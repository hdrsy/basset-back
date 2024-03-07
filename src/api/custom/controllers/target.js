
const { ValidationError } = require('@strapi/utils').errors;

const { getUserFromJwt,checkUserContract } = require('../services/auth');


const success_status = 200;
const unauthorized_user = 401;
module.exports = {
  async getTargetQuestion(ctx){
    const { contract_id } = ctx.request.body;
    if (!ctx.request.body.contract_id) throw new ValidationError(' contract id id is missing');
    // get answer of  contract sector
    let sector_answer = await strapi.entityService.findMany('api::answer.answer', {
      filters:{
              type:2,
              contract : {
                      id : contract_id
               }
          },
    });
    // get targets depending on sector of contract  
    let targets = await strapi.entityService.findMany('api::target.target', {
        fields: ['id', 'title'],
        filters:{
              sector:{
                id: sector_answer[0].text
              }
        },
        populate: {
          targetQuestion: {
            fields: ['text','type','desc'],
          },
        },
      });

      let answers_array = [];
      targets.forEach(element => {
            let answer_item = {
                id : element.id,
                text : element.title,
            }
            answers_array.push(answer_item);            
      });

      
      let target_question = await strapi.entityService.findMany('api::target.target', {
        fields: ['id', 'title'],
        populate: {
          targetQuestion: {
            fields: ['text','type','desc'],
          },
        },
      });
      let questions_array = [];
      target_question.forEach(element => {
                if(element.targetQuestion){
                let question_item= {
                    id : element.targetQuestion.id,
                    text : element.targetQuestion.text,
                    type:element.targetQuestion.type,
                    desc:element.targetQuestion.desc
                }
                if(questions_array.length == 0){
                    questions_array.push(question_item);
                }
             }
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
      message: "types"
    }
    return responseData
  },


  async answerTargetQuestion(ctx){
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
              type:14,
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
        type:14,
        question:question_id,
        contract:{
          id:contract_id
        }
      },
    });
 
    const responseData = {
      data : "",
      statusCode: success_status,
      message: "type successfully answered"
    }
    return responseData;  
  }




};
