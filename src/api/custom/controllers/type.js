
const { ValidationError } = require('@strapi/utils').errors;
const jwt_decode = require("jwt-decode"); //npmpackage
const { getUserFromJwt,checkUserContract } = require('../services/auth');

const success_status = 200;
const unauthorized_user = 401;
module.exports = {
  async getTypeQuestion(ctx){
    // get types and it's questions
    console.log('token');
    console.log(ctx.request.header.token);
    const user = await getUserFromJwt(ctx.request.header.token);
    // return user;
    console.log('user');
    console.log(user);
    // console.log(user.data);
    if(!user){
      const responseData = {
        data : '',
        statusCode: unauthorized_user,
        message: "invalid token"
      }
      return responseData
    }
    let types = await strapi.entityService.findMany('api::type.type', {
        fields: ['id', 'name'],
        populate: {
          typeQuestion: {
            fields: ['text','type','desc'],
          },
        },
      });
      let answers_array = [];
      let questions_array = [];

      types.forEach(element => {
            let answer_item = {
                id : element.id,
                text : element.name,
                desc :element.desc
            }
            answers_array.push(answer_item);
            element.typeQuestion.forEach(item => {
                  let question_item= {
                    id : item.id,
                    text : item.text,
                    type:item.type,
                    desc:item.desc,
                }
                questions_array.push(question_item);
            })
            
      });

      // put options in question 
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


  async answerTypeQuestion(ctx){
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
              type:1,
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
        type:1,
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
