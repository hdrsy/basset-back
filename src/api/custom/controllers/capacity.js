const { ValidationError } = require('@strapi/utils').errors;
const { getUserFromJwt,checkUserContract } = require('../services/auth');

const success_status = 200;
const unauthorized_user = 401;
module.exports = {
    async getCapacityQuestion(ctx){
      const { contract_id } = ctx.request.body;
      if (!ctx.request.body.contract_id) throw new ValidationError(' contract id id is missing');
       // get the type answer of contract
      let type_answers = await strapi.entityService.findMany('api::answer.answer', {

        filters:{
                type:1,
                contract : {
                        id : contract_id
                 }
            },
      });

        let type = type_answers[0];
        let capacities = await strapi.entityService.findMany('api::capacity.capacity', {
            fields: ['title'],
            populate: {
                capacityQuestion: {
                         fields: ['text','type','desc'],
              },
              excludes:{
                fields: ['id'],
              }
            },
          });
          console.log('capacities');
          console.log(capacities);
          let answers_array = [];
          let questions_array = [];
          let capcity_overall_question = {
              id:'112299',
              text:"ماهي صفة التعاقد",
              type:"option"
          }
          
          // build the response for api and exclude the capacity that admin specify in excludes field 
          capacities.forEach(element => {
            let is_in_exludes = false;
            if(element.excludes.length>0){
            for (let i = 0; i < element.excludes.length; i++) {
                if( element.excludes[i].id == parseInt(type.text, 10)){
                  is_in_exludes = true;
                  }
               }
            }
              if(!is_in_exludes ){
              let new_question_array = []
                let answer_item = {
                    id : element.id,
                    text : element.title,
                }
            
                
              //   element.capacityQuestion.forEach(item => {
              //       let question_item= {
              //         id : item.id,
              //         text : item.text,
              //         type:item.type
              //     }
              //     new_question_array.push(question_item);
              // })
              // answer_item.question =new_question_array   
              answers_array.push(answer_item);
              }
          });
          capcity_overall_question.options = answers_array
          questions_array.push(capcity_overall_question)
    
            
          let data_response = {
            question : questions_array,
            // options : []
          }
    
          const responseData = {
          data : data_response,
          statusCode: success_status,
          message: "capacities"
        }
        return responseData

    },

    // get specific capacity questions
    async getSpecificCapacityQuestion(ctx){
      const { capacity_id } = ctx.request.body;
    if (!ctx.request.body.capacity_id) throw new ValidationError(' capacity id id is missing');
   
      let capacities = await strapi.entityService.findMany('api::capacity.capacity', {
          filters:{
                id : capacity_id
          },
          fields: ['title'],
          populate: {
              capacityQuestion: {
                       fields: ['text','type','desc'],
            },
          },
        });
        console.log('capacities');
        console.log(capacities);
        let answers_array = [];
        let question_array = [];
        
        capacities.forEach(element => {
              element.capacityQuestion.forEach(item => {
                  let question_item= {
                    id : item.id,
                    text : item.text,
                    type:item.type,
                    desc:item.desc,
                    options:[]
                }
                question_array.push(question_item);
            })
           
            
        });
        let data_response = {
          question : question_array,
          // options : []
        }

        let question_array_length = question_array.length;
        // add the last question options to be yes or no to add new member to first party
        question_array[question_array_length-1].options = [
          {
            "id": 1,
            "text": "yes"
        },
        {
            "id": 0,
            "text": "No"
        },
        ];
  
        const responseData = {
        data : data_response,
        statusCode: success_status,
        message: "capacities"
      }
      return responseData

  },

    // answer capacity questions  for first party 
    async answerCapacityQuestion(ctx){
       
            const {contract_id,person_num,answer_array } = ctx.request.body;
            if (!ctx.request.body.answer_array) throw new ValidationError('answer array is missing');
            if (!ctx.request.body.contract_id) throw new ValidationError(' contract id is missing');
            if (!ctx.request.body.person_num) throw new ValidationError(' person number is missing');

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

             // insert record for every question's answer
            await answer_array.forEach(element => {
               strapi.entityService.create('api::answer.answer', {
                data: {
                  text:element.answer+"",
                  type:13,
                  question:element.question_id,
                  other:person_num+"",
                  contract:{
                    id:contract_id
                  }
                },
              });
            })


        
            
         
            const responseData = {
              data : "",
              statusCode: success_status,
              message: "capacity successfully answered"
            }
            return responseData;  
          
        
    },


    // answer capacity questions  for second  party 
    async answerSecondPartyCapacityQuestion(ctx){
       
      const {contract_id,person_num,answer_array } = ctx.request.body;
      if (!ctx.request.body.answer_array) throw new ValidationError('answer array is missing');
      if (!ctx.request.body.contract_id) throw new ValidationError(' contract id is missing');
      if (!ctx.request.body.person_num) throw new ValidationError(' person number is missing');
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

       
      await answer_array.forEach(element => {
         strapi.entityService.create('api::answer.answer', {
          data: {
            text:element.answer+"",
            type:15,
            question:element.question_id,
            other:person_num+"",
            contract:{
              id:contract_id
            }
          },
        });
      })


      const responseData = {
        data : "",
        statusCode: success_status,
        message: "second capacity successfully answered"
      }
      return responseData;  
    
  
}
    


}