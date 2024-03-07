
const { ValidationError } = require('@strapi/utils').errors;
const { getUserFromJwt,checkUserContract } = require('../services/auth');

const success_status = 200;
const unauthorized_user = 401;
module.exports = {
  async getSectorQuestion(ctx){
    const { contract_id } = ctx.request.body;
    if (!ctx.request.body.contract_id) throw new ValidationError(' contract id id is missing');
    // get answer of contract type
    let type_answer = await strapi.entityService.findMany('api::answer.answer', {
      filters:{
              type:1,
              contract : {
                      id : contract_id
               }
          },
    });
    // get sector options
    let sectors = await strapi.entityService.findMany('api::sector.sector', {
        filters:{
                 type : {
                        id : type_answer[0].text
                 }
            },
        fields: ['id', 'name'],
        populate: {
            sectorQuestion: {
            fields: ['text','type','desc'],
          },
        },
      });


      console.log('sectors');
      console.log(sectors);
        // get options for question
        let answers_array = [];
        sectors.forEach(element => {
              let answer_item = {
                  id : element.id,
                  text : element.name,
              }
              answers_array.push(answer_item);
        });

      // get question for sectors 
      let sector_question = await strapi.entityService.findMany('api::sector.sector', {
        fields: ['id', 'name'],
        populate: {
            sectorQuestion: {
            fields: ['text','type','desc'],
          },
        },
      });
      let questions_array = [];
      sector_question.forEach(element => {
                if(element.sectorQuestion){
                let question_item= {
                    id : element.sectorQuestion.id,
                    text : element.sectorQuestion.text,
                    type:element.sectorQuestion.type,
                    desc:element.sectorQuestion.desc
                }
                if(questions_array.length == 0){
                    questions_array.push(question_item);
                }
             }
      });

      // set options inside question
      questions_array.forEach(element=>{
        element.options = answers_array;
    })
      let data_response = {
        question : questions_array,
      }
      const responseData = {
      data : data_response,
      statusCode: success_status,
      message: "sectors"
    }
    return responseData
  },

  async answerSectorQuestion(ctx){
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


    // check if user has already answered .... delete old answer

      let answers = await strapi.entityService.findMany('api::answer.answer', {
        filters:{
                question_id : question_id,
                type:2,
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
        type:2,
        question:question_id,
        contract:{
          id:contract_id
        }
      },
    });
 
    const responseData = {
      data : "",
      statusCode: success_status,
      message: "sector successfully answered"
    }
    return responseData;  
  }

};
