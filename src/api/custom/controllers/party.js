const { ValidationError } = require('@strapi/utils').errors;
const { getUserFromJwt,checkUserContract } = require('../services/auth');

const success_status = 200;
const unauthorized_user = 401;
module.exports = {
    async getPartyQuestion(ctx){
      const { contract_id } = ctx.request.body;
      if (!ctx.request.body.contract_id) throw new ValidationError(' contract id id is missing');
       // get the target answer of contract
      let target_answer = await strapi.entityService.findMany('api::answer.answer', {
        filters:{
                type:14,
                contract : {
                        id : contract_id
                 }
            },
      });
      // get the first party question of specified target that answered of the contract
        let parties = await strapi.entityService.findMany('api::party.party', {
          filters:{
            target : {
                   id : target_answer[0].text
            }
          },
            populate: {
                partyQuestion: {
                         fields: ['text','type','desc'],
              },
            },
          });

          
          console.log('party_answer');
          console.log(parties);
         
          // return types;
          let answers_array = [];
          let questions_array = [];
    
          parties.forEach(element => {
                // let answer_item = {
                //     id : element.id,
                //     text : element.name,
                // }
                // answers_array.push(answer_item);
                element.partyQuestion.forEach(item => {
                    let question_item= {
                      id : item.id,
                      text : item.text,
                      type:item.type,
                      desc:item.desc
                  }
                  questions_array.push(question_item);
              })
          });
    
          questions_array.forEach(element=>{
            element.options = [];
        })
            
        // let question_array_length = questions_array.length;
        // // add the last question options to be yes or no to add new member to first party
        // questions_array[question_array_length-1].options = [
        //   {
        //     "id": 0,
        //     "text": "yes"
        // },
        // {
        //     "id": 0,
        //     "text": "No"
        // },
        // ];
        let  data_response = {
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


    async getSecondPartyQuestion(ctx){
      const { contract_id } = ctx.request.body;
      if (!ctx.request.body.contract_id) throw new ValidationError(' contract id id is missing');
      // get answer of contract target
      let target_answer = await strapi.entityService.findMany('api::answer.answer', {
        filters:{
                type:14,
                contract : {
                        id : contract_id
                 }
            },
      });
      // get the second party question of specified target that answered of the contract
        let parties = await strapi.entityService.findMany('api::party.party', {
          filters:{
            target : {
                   id : target_answer[0].text
            }
          },
            populate: {
              secondPartyQuestion: {
                         fields: ['text','type','desc'],
              },
            },
          });

          
          console.log('party_answer');
          console.log(parties);
         
          // return types;
          let answers_array = [];
          let questions_array = [];
    
          parties.forEach(element => {
                // let answer_item = {
                //     id : element.id,
                //     text : element.name,
                // }
                // answers_array.push(answer_item);
                element.secondPartyQuestion.forEach(item => {
                    let question_item= {
                      id : item.id,
                      text : item.text,
                      type:item.type,
                      desc:item.desc
                  }
                  questions_array.push(question_item);
              })
          });
    
          questions_array.forEach(element=>{
            element.options = [];
        })

        // let question_array_length = questions_array.length;
        //  // add the last question options to be yes or no to add new member to second party
        // questions_array[question_array_length-1].options = [
        //   {
        //     "id": 0,
        //     "text": "yes"
        // },
        // {
        //     "id": 0,
        //     "text": "No"
        // },
        // ];

            
          let data_response = {
            question : questions_array,
            // options : []
          }
    
          const responseData = {
          data : data_response,
          statusCode: success_status,
          message: "second party questions"
        }
        return responseData
    

    },

    // answer first party questions
    async answerFirstPartyQuestion(ctx){
       
            const {contract_id,person_num,answer_array} = ctx.request.body;
            if (!ctx.request.body.answer_array) throw new ValidationError(' answer array is missing');
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
                type:3,
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
              message: "first party successfully answered"
            }
            return responseData;  
          
        
    },
      // answer second party questions
    async answerSecondPartyQuestion(ctx){
       
       
          const {contract_id,person_num,answer_array} = ctx.request.body;
          if (!ctx.request.body.answer_array) throw new ValidationError(' answer array is missing');
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
              type:4,
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
          message: "second party successfully answered"
        }
        return responseData;  
      
    
}







// async answerFirstPartyQuestion(ctx){
       
//   const {question_id,answer_id,contract_id,person_num} = ctx.request.body;
//   if (!ctx.request.body.question_id) throw new ValidationError(' question id is missing');
//   if (!ctx.request.body.answer_id) throw new ValidationError(' answer id is missing');
//   if (!ctx.request.body.contract_id) throw new ValidationError(' contract id is missing');
//   if (!ctx.request.body.person_num) throw new ValidationError(' person number is missing');

   

//   await strapi.entityService.create('api::answer.answer', {
//     data: {
//       text:answer_id+"",
//       type:3,
//       question:question_id,
//       other:person_num,
//       contract:{
//         id:contract_id
//       }
//     },
//   });

//   const responseData = {
//     data : "",
//     statusCode: success_status,
//     message: "sector successfully answered"
//   }
//   return responseData;  


// },

}