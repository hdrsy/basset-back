// const officegen = require('officegen');
// const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const PDFDocument = require('pdfkit');
const { getUserFromJwt,checkUserContract } = require('../services/auth');
const success_status = 200;
const unauthorized_user = 401;
// import * as fs from "fs";
const docx = require('docx');
// const Docxtemplater = require('docxtemplater');
const https = require('https');
const http = require('http');

const { Document, Footer, Header, Packer, Paragraph, TextRun,AlignmentType } = require('docx');

module.exports = {
  // ... other controller actions

  async reverseNumbersAndDates (text){
    const regex = '/\d+/g'; // Regular expression to match sequences of digits

    const reverseString = (str) => str.split('').reverse().join('');

    return text.replace(regex, match => reverseString(match));
    },
  async  getContractFirstParty(contract_id) {
    try {
        let results  = await strapi.entityService.findMany('api::answer.answer', {
            filters:{
                    type:3,
                    contract : {
                            id : contract_id
                     }
                },
          })
        
          // get max number of person in first party
          const maxOtherValue = results.reduce((max, record) => {
            if (record.other > max) {
              return record.other;
            }
            return max;
          }, 0); 


          let target_answer = await strapi.entityService.findMany('api::answer.answer', {
            filters:{
                    type:14,
                    contract : {
                            id : contract_id
                     }
                },
          });
          // get questions for specific target
            let parties = await strapi.entityService.findMany('api::party.party', {
              filters:{
                target : {
                       id : target_answer[0].text
                }
              },
                populate: {
                    partyQuestion: {
                             fields: ['text','type'],
                  },
                },
              });
          let first_party_text = ''; 
          let party = parties[0];   
          for (let j = 1; j <= maxOtherValue; j++) {
            let paragraph = party.first;
            
            for (let item of party.partyQuestion) {
                let target_answers = await strapi.entityService.findMany('api::answer.answer', {
                    filters: {
                        type: 3,
                        other: j,
                        question: item.id,
                        contract: {
                            id: contract_id
                        }
                    },
                });
                
                // Check if there are any answers before accessing them
                if (target_answers.length > 0) {
                    let target_answer = target_answers[0];
                    console.log('target_answer');
                    console.log(target_answer.text);
                    var temp = target_answer.text;
                    temp = await this.reverseNumbersAndDates(temp);
                    console.log('temp');
                    console.log(temp);
                    paragraph = paragraph.replace('$', temp);
                }
            }

            
            // get capacity text 
            
            let capacity_first_question = await strapi.entityService.findMany('api::answer.answer', {
                filters: {
                    type: 13,
                    other: j,
                    question: 112299,
                    contract: {
                        id: contract_id
                    }
                },
            });
            let capacity_first_answer = capacity_first_question[0].text;
            let capacity_paragraph_text ='';
            if(capacity_first_answer){
            let capacities = await strapi.entityService.findMany('api::capacity.capacity', {
                filters:{
                      id : capacity_first_answer
                },
                fields: ['title','paragraph'],
                populate: {
                    capacityQuestion: {
                             fields: ['text','type'],
                  },
                },
              });
            
            let capacity = capacities[0];   
            capacity_paragraph_text =  capacity.paragraph;  
              for (let item of capacity.capacityQuestion) {
                  let capacity_answers = await strapi.entityService.findMany('api::answer.answer', {
                      filters: {
                          type: 13,
                          other: j,
                          question: item.id,
                          contract: {
                              id: contract_id
                          }
                      },
                  });
                  
                  // Check if there are any answers before accessing them
                  if (capacity_answers.length > 0) {
                      let capacity_answer = capacity_answers[0];
                      capacity_paragraph_text = capacity_paragraph_text.replace('$', capacity_answer.text);
                    }
                }
 
            }

            first_party_text += ","+paragraph + " " +capacity_paragraph_text;
        }

            console.log(first_party_text);
            console.log('first_party_text')
          return first_party_text;
    } catch (exception) {
        console.log('exception');
        console.log(exception)
      return '';
    }
  },

  async  getContractSecondParty(contract_id) {
    try {
        let results  = await strapi.entityService.findMany('api::answer.answer', {
            filters:{
                    type:4,
                    contract : {
                            id : contract_id
                     }
                },
          })
        
          // get max number of person in first party
          const maxOtherValue = results.reduce((max, record) => {
            if (record.other > max) {
              return record.other;
            }
            return max;
          }, 0); 


          let target_answer = await strapi.entityService.findMany('api::answer.answer', {
            filters:{
                    type:14,
                    contract : {
                            id : contract_id
                     }
                },
          });
            let parties = await strapi.entityService.findMany('api::party.party', {
              filters:{
                target : {
                       id : target_answer[0].text
                }
              },
                populate: {
                    secondPartyQuestion: {
                             fields: ['text','type'],
                  },
                },
              });
          let second_party_text = ''; 
          let party = parties[0];   
          for (let j = 1; j <= maxOtherValue; j++) {
            let paragraph = party.second;
            
            for (let item of party.secondPartyQuestion) {
                let target_answers = await strapi.entityService.findMany('api::answer.answer', {
                    filters: {
                        type: 4,
                        other: j,
                        question: item.id,
                        contract: {
                            id: contract_id
                        }
                    },
                });
                
                // Check if there are any answers before accessing them
                if (target_answers.length > 0) {
                    let target_answer = target_answers[0];
                    paragraph = paragraph.replace('$', target_answer.text);
                }
            }


             // get capacity text 
            
             let capacity_first_question = await strapi.entityService.findMany('api::answer.answer', {
                filters: {
                    type: 15,
                    other: j,
                    question: 112299,
                    contract: {
                        id: contract_id
                    }
                },
            });
            let capacity_first_answer = capacity_first_question[0].text;
            let capacity_paragraph_text ='';
            if(capacity_first_answer){
            let capacities = await strapi.entityService.findMany('api::capacity.capacity', {
                filters:{
                      id : capacity_first_answer
                },
                fields: ['title','paragraph'],
                populate: {
                    capacityQuestion: {
                             fields: ['text','type'],
                  },
                },
              });
            
            let capacity = capacities[0];   
            capacity_paragraph_text =  capacity.paragraph;  
              for (let item of capacity.capacityQuestion) {
                  let capacity_answers = await strapi.entityService.findMany('api::answer.answer', {
                      filters: {
                          type: 15,
                          other: j,
                          question: item.id,
                          contract: {
                              id: contract_id
                          }
                      },
                  });
                  
                  // Check if there are any answers before accessing them
                  if (capacity_answers.length > 0) {
                      let capacity_answer = capacity_answers[0];
                      capacity_paragraph_text = capacity_paragraph_text.replace('$', capacity_answer.text);
                    }
                }
 
            }

            second_party_text += ","+paragraph + " "+capacity_paragraph_text;
        }
       
          return second_party_text;
    } catch (exception) {
      return '';
    }
  },


  async  getContractBegin(contract_id) {
    try {
         let target_answer = await strapi.entityService.findMany('api::answer.answer', {
            filters:{
                    type:14,
                    contract : {
                            id : contract_id
                     }
                },
          });
      
          let begins = await strapi.entityService.findMany('api::begin.begin', {
              filters:{
                       target : {
                              id : target_answer[0].text
                       }
                  },
              populate: {
                  documentQuestion: {
                           fields: ['text','type'],
                },
              },
            });
        
        let begin = begins[0];   
        let first_paragraph =  begin.paragraph51; 
        let second_paragraph =  begin.paragraph52; 
        
          for (let item of begin.documentQuestion) {
              let begin_answers = await strapi.entityService.findMany('api::answer.answer', {
                  filters: {
                      type: 5,
                      question: item.id,
                      contract: {
                          id: contract_id
                      }
                  },
              });
              
              // Check if there are any answers before accessing them
              if (begin_answers.length > 0) {
                  let begin_answer = begin_answers[0];
                  first_paragraph = first_paragraph.replace('$', begin_answer.text);
                }
            }
            let results = [];
            results['first_paragraph']= first_paragraph;
            results['second_paragraph']= second_paragraph;
            return results;

    } catch (exception) {
        let results = [];
        results['first_paragraph']= 'bug';
        results['second_paragraph']= 'bug';
        return results;
    }
  },


  async  getContractFirstCommitment(contract_id) {
    try {
         let target_answer = await strapi.entityService.findMany('api::answer.answer', {
            filters:{
                    type:14,
                    contract : {
                            id : contract_id
                     }
                },
          });
      
          let firstcommitment_results = await strapi.entityService.findMany('api::middle.middle', {
              filters:{
                       target : {
                              id : target_answer[0].text
                       }
                  },
                  populate: {
                    firstcommitment: {
                             fields: ['text'],
                             populate:{
                                firstcommitmentQuestion:{
                                    fields: ['text','type'],
                                }
                             }
                  },
                },
            });
        
            let firstcommitment_result = firstcommitment_results[0].firstcommitment;   
            let firstcommitment_paragraph =  firstcommitment_result[0].text;
              for (let item of firstcommitment_result[0].firstcommitmentQuestion) {
                  let firstcommitment_answers = await strapi.entityService.findMany('api::answer.answer', {
                      filters: {
                          type: 9,
                          question: item.id,
                          contract: {
                              id: contract_id
                          }
                      },
                  });
                  // Check if there are any answers before accessing them
                  if (firstcommitment_answers.length > 0) {
                      let firstcommitment_answer = firstcommitment_answers[0];
                      firstcommitment_paragraph = firstcommitment_paragraph.replace('$', firstcommitment_answer.text);
                    }
                }
                return firstcommitment_paragraph;
    
        } catch (exception) {
            return '';
        }
  },
  async  getContractSecondCommitment(contract_id) {
    try {
         let target_answer = await strapi.entityService.findMany('api::answer.answer', {
            filters:{
                    type:14,
                    contract : {
                            id : contract_id
                     }
                },
          });
      
          let secondcommitment_results = await strapi.entityService.findMany('api::middle.middle', {
              filters:{
                       target : {
                              id : target_answer[0].text
                       }
                  },
                  populate: {
                    secondcommitment: {
                             fields: ['text'],
                             populate:{
                                secondcommitmentQuestion:{
                                    fields: ['text','type'],
                                }
                             }
                  },
                },
            });
        
            let secondcommitment_result = secondcommitment_results[0].secondcommitment;   
            let secondcommitment_paragraph =  secondcommitment_result[0].text;
              for (let item of secondcommitment_result[0].secondcommitmentQuestion) {
                  let secondcommitment_answers = await strapi.entityService.findMany('api::answer.answer', {
                      filters: {
                          type: 10,
                          question: item.id,
                          contract: {
                              id: contract_id
                          }
                      },
                  });
                  // Check if there are any answers before accessing them
                  if (secondcommitment_answers.length > 0) {
                      let secondcommitment_answer = secondcommitment_answers[0];
                      secondcommitment_paragraph = secondcommitment_paragraph.replace('$', secondcommitment_answer.text);
                    }
                }
                return secondcommitment_paragraph;
    
        } catch (exception) {
            return '';
        }
  },

  async  getContractOptionalProvision(contract_id) {
    try {
         let target_answer = await strapi.entityService.findMany('api::answer.answer', {
            filters:{
                    type:14,
                    contract : {
                            id : contract_id
                     }
                },
          });
      
            let optionalprovisions_results = await strapi.entityService.findMany('api::middle.middle', {
                filters:{
                        sector : {
                                id : target_answer[0].text
                        }
                    },
                // fields: ['kind'],
                populate: {
                    optionalprovisions: {
                            fields: ['text'],
                            populate:{
                                provisionQuestion:{
                                    fields: ['text','type'],
                                }
                            }
                },
                },
            });
        
            let optionalprovisions_result = optionalprovisions_results[0].optionalprovisions;   
            let optionalprovisions_paragraph =  optionalprovisions_result[0].text;
            let item = optionalprovisions_result[0].provisionQuestion;
                  let optionalprovisions_answers = await strapi.entityService.findMany('api::answer.answer', {
                      filters: {
                          type: 12,
                          question: item.id,
                          contract: {
                              id: contract_id
                          }
                      },
                  });
                  // Check if there are any answers before accessing them
                  if (optionalprovisions_answers.length > 0) {
                      let optionalprovisions_answer = optionalprovisions_answers[0];
                      optionalprovisions_paragraph = optionalprovisions_paragraph+ ','+optionalprovisions_answer.text;
                    }
                
                return optionalprovisions_paragraph;
    
        } catch (exception) {
            return '';
        }
  },

//   async getComplexParagraph(contract_id,questionId){

//     // return complexId+"????";
//     let result_paragraph= questionId+"????";
//     try {
//         console.log('questionId');
//         console.log(questionId);
//         let complex_answer = await strapi.entityService.findMany('api::answer.answer', {
//             filters: {
//                 type : 11,
//                 question : questionId,
//                 contract : {
//                     id : contract_id
//              }
//             },
//         }); 
        
//         let complexoptions = await strapi.entityService.findMany('api::complexoption.complexoption', {
//             filters:{
//                      id :  complex_answer[0].text
//                 },
//             fields: ['id', 'title','paragraph'],
//             populate: {
//               complexquestions: {
//                 fields: ['text','type','desc'],
//                 sort: {id: 'ASC'},
//               },
//             },
//           });
         
//          let questions = complexoptions[0].complexquestions;
//          let Paragraph = complexoptions[0].paragraph;
//          console.log('questions');
//         console.log(questions);
//         console.log('Paragraph');
//         console.log(Paragraph);
//         await questions.forEach(element => {
//             let complex_answers = strapi.entityService.findMany('api::answer.answer', {
//                 filters: {
//                     type : 16,
//                     question : element.id,
//                     contract : {
//                         id : contract_id
//                  }
//                 },
//                 fields:['text']
//             }).then(function(response_array) {
//                 console.log('response_array');
//                 console.log(response_array);
//                      if (response_array.length > 0) {
//                             let complex_answer = response_array[0];
//                             Paragraph = Paragraph.replace('$', complex_answer.text);
                
//                      } 
//               });
            
//         });
//          return Paragraph;
//    } catch (exception) {
//         console.log('exception');
//         console.log(exception);
//        return '';
//    }
//   },

//   async getPriceQuestionParagraph(contract_id,priceQuestions,price_paragraph_item){
//       try{
//             for (let item of  priceQuestions) {
//                 console.log('item.complex');
//                 console.log(item.complex);
//                 if(item.complex==null){
//                     let price_answers = await strapi.entityService.findMany('api::answer.answer', {
//                         filters: {
//                             type: 11,
//                             question: item.id,
//                             contract: {
//                                 id: contract_id
//                             }
//                         },
//                     });
//                     // Check if there are any answers before accessing them
//                     if (price_answers.length > 0) {
//                         let price_answer = price_answers[0];
//                         price_paragraph_item = price_paragraph_item.replace('$', price_answer.text);
//                     }
//                 }else{
//                     console.log('in complex');
//                     console.log(item.complex.id);
//                     // get complex paragraph
//                     price_paragraph_item = await this.getComplexParagraph(contract_id,item.id);
//                 }
//         }
//         console.log('price_paragraph_item');
//         console.log(price_paragraph_item);
//         return price_paragraph_item;
//     }catch(exception){
//         console.log('exception');
//         console.log(exception);
//         return '';
//     }
        
//   },



async getComplexParagraph(contract_id, questionId) {
    let result_paragraph = questionId + "????";
    try {
      console.log('questionId');
      console.log(questionId);
      let complex_answer = await strapi.entityService.findMany('api::answer.answer', {
        filters: {
          type: 11,
          question: questionId,
          contract: {
            id: contract_id
          }
        },
      });
  
      let complexoptions = await strapi.entityService.findMany('api::complexoption.complexoption', {
        filters: {
          id: complex_answer[0].text
        },
        fields: ['id', 'title', 'paragraph'],
        populate: {
          complexquestions: {
            fields: ['text', 'type', 'desc'],
            sort: { id: 'ASC' },
          },
        },
      });
  
      let questions = complexoptions[0].complexquestions;
      let Paragraph = complexoptions[0].paragraph;
      console.log('questions');
      console.log(questions);
      console.log('Paragraph');
      console.log(Paragraph);
  
      await Promise.all(questions.map(async (element) => {
        let complex_answers = await strapi.entityService.findMany('api::answer.answer', {
          filters: {
            type: 16,
            question: element.id,
            contract: {
              id: contract_id
            }
          },
          fields: ['text']
        });
  
        console.log('response_array');
        console.log(complex_answers);
        if (complex_answers.length > 0) {
          let complex_answer = complex_answers[0];
          Paragraph = Paragraph.replace('$', complex_answer.text);
        }
      }));
  
      return Paragraph;
    } catch (exception) {
      console.log('exception');
      console.log(exception);
      return '';
    }
  },
  async getPriceQuestionParagraph(contract_id, priceQuestions, price_paragraph_item) {
    try {
      await Promise.all(priceQuestions.map(async (item) => {
        console.log('item.complex');
        console.log(item.complex);
        if (item.complex == null) {
          let price_answers = await strapi.entityService.findMany('api::answer.answer', {
            filters: {
              type: 11,
              question: item.id,
              contract: {
                id: contract_id
              }
            },
          });
          // Check if there are any answers before accessing them
          if (price_answers.length > 0) {
            let price_answer = price_answers[0];
            price_paragraph_item = price_paragraph_item.replace('$', price_answer.text);
          }
        } else {
          console.log('in complex');
          console.log(item.complex.id);
          // get complex paragraph
          price_paragraph_item = await this.getComplexParagraph(contract_id, item.id);
        }
      }));
  
      console.log('price_paragraph_item');
      console.log(price_paragraph_item);
      return price_paragraph_item;
    } catch (exception) {
      console.log('exception');
      console.log(exception);
      return '';
    }
  },

    async  getContractPrice(contract_id) {
    try {
        console.log('getContractPrice');
         let target_answer = await strapi.entityService.findMany('api::answer.answer', {
            filters:{
                    type:14,
                    contract : {
                            id : contract_id
                     }
                },
          });
          console.log('before in price');
          let price_results = await strapi.entityService.findMany('api::middle.middle', {
            filters:{
                     target : {
                            id : target_answer[0].text
                     }
                },
            // fields: ['kind'],
            populate: {
                price: {
                         fields: ['title','paragraph'],
                         populate:{
                            priceQuestion:{
                                fields: ['text','type'],
                                populate:{
                                    complex:{
                                        fields:['id']
                                    }
                                }
                            }
                         }
              },
            },
          });
          console.log('after before in price');

          console.log('in price');
            let price_result = price_results[0];   
            let price_paragraph = '';
            console.log('price_result');
            console.log(price_result);
            // for (let element of  price_result.price) {
            //     let price_paragraph_item = element.paragraph;
            //     console.log('element.priceQuestion');
            //     console.log(element.priceQuestion);
            //   price_paragraph_item = await this.getPriceQuestionParagraph(contract_id, element.priceQuestion,price_paragraph_item);
            //   price_paragraph = price_paragraph+price_paragraph_item+",";
            // }
            //     return price_paragraph;
            const promises = price_result.price.map(async (element) => {
                let price_paragraph_item = element.paragraph;
                console.log('element.priceQuestion');
                console.log(element.priceQuestion);
                price_paragraph_item = await this.getPriceQuestionParagraph(contract_id, element.priceQuestion,price_paragraph_item);
                return price_paragraph_item;
              });
              
              const paragraphs = await Promise.all(promises);
              price_paragraph = paragraphs.join(",");
              return price_paragraph;
        } catch (exception) {
            console.log('exception');
            console.log(exception);
            return '';
        }
  },
  async  getContractEnd(contract_id) {
    try {
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
                     sector : {
                            id : target_answer[0].text
                     }
                },
            fields: ['text'],
            sort: {id: 'ASC'},
            populate: {
                conditionQuestion: {
                         fields: ['text','type'],
              },
            },
          });

          
          let Paragraph = '';
          for (let element of conditions) {
            if(element.conditionQuestion){
                let end_answers = await strapi.entityService.findMany('api::answer.answer', {
                    filters: {
                        type : 6,
                        question : element.conditionQuestion.id,
                        contract : {
                            id : contract_id
                     }
                    },
                });
                    
                   

                         

                    if (end_answers.length > 0) {
                        if(element.conditionQuestion.type=='form'){
                            let end_answer = end_answers[0];
                            Paragraph = Paragraph + ","+  element.text.replace('$', end_answer.text);
                        }else{
                            Paragraph = Paragraph+ ","+ element.text;
                        }
                    } 
                }
              // })
          }
          return Paragraph;
    } catch (exception) {
        return '';
    }
  },

  // replace \n with enter
async prepareParagraph(delimitedText){
    delimitedText = delimitedText.replace(/\n/g, " ");
    console.log('delimitedText');
    console.log(delimitedText);
    let delimitedArray = delimitedText.split(","); // split the string into an array based on the comma character
    const result = []; // create an empty array to hold the TextRun objects
    delimitedArray.forEach((text) => {
        console.log('text');
        console.log(text);
        // text2 = text.replace(/\n/g, " ");
    //   const textRun = new TextRun({
    //     text: text.trim(),
    //     rightToLeft: true,
    //     size: 25,
    //   });
    //   const textRun2 = new TextRun({
    //       text: '',
    //       break: 1
    //     });

        result.push(text); // insert the TextRun object into the array
        // result.push(textRun2); // add a line break after each TextRun object
    });
    return result;
},

async download(ctx){
    
    try {
        const { contract_id } = ctx.request.body;
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

        // const fileUrl = 'http://localhost:3000/';  // add the endpoint if it's different
        // const fileName = 'My_Document.docx';
        // const filePath = path.join('/baseet', fileName);
    
        // const file = fs.createWriteStream(filePath);
        // http.get(fileUrl, function(response) {
        //     response.pipe(file);
        // }).on('error', (err) => {
        //     console.error("Error downloading the file:", err.message);
        // });
        // console.log(strapi.config);
        // console.log(strapi.config.paths);
        // const filePath = path.join(strapi.config.paths.app, 'D:\\basset\\My_Document.docx');

        const filePath = path.resolve(__dirname, '../../../../pdf/'+user.id+'/'+contract_id+'.pdf');
        ctx.set('Content-disposition', 'attachment; filename=1.pdf');
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    

        // const filePath = path.resolve(__dirname, '../../../../pdf/2/3.docx');
        // const filePath = path.resolve(__dirname, '/var/local/baseet/pdf/2/3.docx');
        // ctx.set('Content-disposition', 'attachment; filename=3.docx');
        // ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        ctx.body = fs.createReadStream(filePath);

     
    
    } catch(err) {
        console.error(err);
    }


},
async download_docx(ctx){
    
    try {
        const { contract_id } = ctx.request.body;
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

        // const fileUrl = 'http://localhost:3000/';  // add the endpoint if it's different
        // const fileName = 'My_Document.docx';
        // const filePath = path.join('/baseet', fileName);
    
        // const file = fs.createWriteStream(filePath);
        // http.get(fileUrl, function(response) {
        //     response.pipe(file);
        // }).on('error', (err) => {
        //     console.error("Error downloading the file:", err.message);
        // });
        // console.log(strapi.config);
        // console.log(strapi.config.paths);
        // const filePath = path.join(strapi.config.paths.app, 'D:\\basset\\My_Document.docx');

        // const filePath = path.resolve(__dirname, '../../../../pdf/'+user.id+'/'+contract_id+'.pdf');
        // ctx.set('Content-disposition', 'attachment; filename=1.pdf');
        // ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    

        const filePath = path.resolve(__dirname, '../../../../pdf/2/3.docx');
        // const filePath = path.resolve(__dirname, '/var/local/baseet/pdf/'+user.id+'/'+contract_id+'.docx');
        ctx.set('Content-disposition', 'attachment; filename=3.docx');
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        ctx.body = fs.createReadStream(filePath);

     
    
    } catch(err) {
        console.error(err);
    }


},
async admin_download(ctx){
    
    try {
        const contract_id = ctx.params.contract_id;
            // check User Token
        const contracts = await strapi.entityService.findMany('api::contract.contract', {
            filters:{
                    id:contract_id,
                },
             populate: {
                 users_permissions_user: {
                            fields: ['id'],
                        },
                }   
              });
        let user_id = contracts[0].users_permissions_user.id;
        // const fileUrl = 'http://localhost:3000/';  // add the endpoint if it's different
        // const fileName = 'My_Document.docx';
        // const filePath = path.join('/baseet', fileName);
    
        // const file = fs.createWriteStream(filePath);
        // http.get(fileUrl, function(response) {
        //     response.pipe(file);
        // }).on('error', (err) => {
        //     console.error("Error downloading the file:", err.message);
        // });
        // console.log(strapi.config);
        // console.log(strapi.config.paths);
        // const filePath = path.join(strapi.config.paths.app, 'D:\\basset\\My_Document.docx');

        const filePath = path.resolve(__dirname, '../../../../pdf/'+user_id+'/'+contract_id+'.pdf');
        ctx.set('Content-disposition', 'attachment; filename=1.pdf');
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    

        // const filePath = path.resolve(__dirname, '../../../../pdf/2/3.docx');
        // const filePath = path.resolve(__dirname, '/var/local/baseet/pdf/2/3.docx');
        // ctx.set('Content-disposition', 'attachment; filename=3.docx');
        // ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        ctx.body = fs.createReadStream(filePath);

     
    
    } catch(err) {
        console.error(err);
    }


},
async admin_download_docx(ctx){
    
    try {
        const contract_id = ctx.params.contract_id;
        const contracts = await strapi.entityService.findMany('api::contract.contract', {
            filters:{
                    id:contract_id,
                },
             populate: {
                 users_permissions_user: {
                            fields: ['id'],
                        },
                }   
              });
        let user_id = contracts[0].users_permissions_user.id;
        // check User Token
        // const fileUrl = 'http://localhost:3000/';  // add the endpoint if it's different
        // const fileName = 'My_Document.docx';
        // const filePath = path.join('/baseet', fileName);
    
        // const file = fs.createWriteStream(filePath);
        // http.get(fileUrl, function(response) {
        //     response.pipe(file);
        // }).on('error', (err) => {
        //     console.error("Error downloading the file:", err.message);
        // });
        // console.log(strapi.config);
        // console.log(strapi.config.paths);
        // const filePath = path.join(strapi.config.paths.app, 'D:\\basset\\My_Document.docx');

        // const filePath = path.resolve(__dirname, '../../../../pdf/'+user.id+'/'+contract_id+'.pdf');
        // ctx.set('Content-disposition', 'attachment; filename=1.pdf');
        // ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    

        const filePath = path.resolve(__dirname, '../../../../pdf/2/3.docx');
        // const filePath = path.resolve(__dirname, '/var/local/baseet/pdf/'+user_id+'/'+contract_id+'.docx');
        ctx.set('Content-disposition', 'attachment; filename=3.docx');
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        ctx.body = fs.createReadStream(filePath);

     
    
    } catch(err) {
        console.error(err);
    }


},
async generatePDF(ctx) {
        const docxFilePath = '../../../../My_Document.docx';  // Replace with your DOCX file path
        const { contract_id } = ctx.request.body;
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

   
    //   const contract_id = 3; 
    // get type answer 
    let type_answers = await strapi.entityService.findMany('api::answer.answer', {
        filters:{
                type:1,
                contract : {
                        id : contract_id
                 }
            },
      });

      let types = await strapi.entityService.findMany('api::type.type', {
        filters:{
               id: type_answers[0].text
            },
      });
    let type =  types[0].name  


    let Sector_answers = await strapi.entityService.findMany('api::answer.answer', {
        filters:{
                type:2,
                contract : {
                        id : contract_id
                 }
            },
      });

      let sectors = await strapi.entityService.findMany('api::sector.sector', {
        filters:{
               id: Sector_answers[0].text
            },
      });
    let sector =  sectors[0].name 
    
    let target_answers = await strapi.entityService.findMany('api::answer.answer', {
        filters:{
                type:14,
                contract : {
                        id : contract_id
                 }
            },
      });

      let targets = await strapi.entityService.findMany('api::target.target', {
        filters:{
               id: target_answers[0].text
            },
      });
    let target =  targets[0].title
     


      let firstPartyText = await this.getContractFirstParty(contract_id);
      //prepare text for each person in first party
      let preparedFirstPartyText =await  this.prepareParagraph(firstPartyText);
     
        
      let secondPartyText = await this.getContractSecondParty(contract_id);
       //prepare text for each person in second party
      let preparedSecondPartyText =await  this.prepareParagraph(secondPartyText);
     
      let beginTextresult = await this.getContractBegin(contract_id);
      let first_paragraph = beginTextresult['first_paragraph'];
      let preparedFirstParagraph =await  this.prepareParagraph(first_paragraph);
      let second_paragraph = beginTextresult['second_paragraph']
      let firstCommitmentText = await this.getContractFirstCommitment(contract_id);
      let preparedFirstCommitment =await  this.prepareParagraph(firstCommitmentText);
      let SecondCommitmentText = await this.getContractSecondCommitment(contract_id);
      let preparedSecondCommitment =await  this.prepareParagraph(SecondCommitmentText);
      let OptionalProvisionText = await this.getContractOptionalProvision(contract_id);
       //prepare text for each person in second party
       let preparedOptionalProvisionText =await  this.prepareParagraph(OptionalProvisionText);
      let PriceText = await this.getContractPrice(contract_id);
      //prepare text for each person in price
      let preparedPriceText =await  this.prepareParagraph(PriceText);

      let endText = await this.getContractEnd(contract_id);
        //prepare text for each person in end 
      let preparedEndText =await  this.prepareParagraph(endText);

      // Create a new PDF document
      const doc = new PDFDocument();

      // Specify the path where you want to save the PDF


    //   const savePath = 'E:/files/baseet/baseet/pdf/'+user.id+'/'+contract_id+'.pdf';  // Replace with your desired path

    //   const pdfspath = 'E:/files/baseet/baseet/pdf/'+user.id;
    //   console.log('pdfspath');
    //   console.log(!fs.existsSync(pdfspath));
      
    const savePath = 'pdf/'+user.id+'/'+contract_id+'.pdf';  // Replace with your desired path

    const pdfspath = 'pdf/'+user.id;
    console.log('pdfspath');
    console.log(!fs.existsSync(pdfspath));
    
    
    
    // if (!fs.existsSync(pdfspath)) {
        // console.log(`Path ${pdfspath} does not exist.`);
        // } else {
        //     console.log(`Path ${pdfspath} exists.`);
        // }
        try {
            console.log('try');
            let stats = fs.statSync(pdfspath);
            console.log('stats');
            console.log(stats);
            console.log('!stats.isDirectory()');
            console.log(!stats.isDirectory());
            if (!stats.isDirectory()) {
                throw new Error("Path exists but it's not a directory");
            }
        } catch (error) {
            console.log('error');
            console.log(error);
            if (error.code === 'ENOENT') { // Path does not exist
                fs.mkdirSync(pdfspath, { recursive: true });
            } else {
                console.error(error);
            }
        }

      if (!fs.existsSync(pdfspath)) {
          console.log('ddddd');
        fs.mkdirSync(pdfspath, { recursive: true });  // recursive: true ensures parent directories are created if they don't exist
    }

      // Create a write stream for the specified path
      const writeStream = fs.createWriteStream(savePath);

      // Register the font
      doc.registerFont('Arabic','E:/files/baseet/baseet/NotoNaskhArabic-VariableFont_wght.ttf'); // Make sure to provide the correct path to your Arabic font file
        // doc.registerFont('Arabic','/var/local/baseet/NotoNaskhArabic-VariableFont_wght.ttf'); // Make sure to provide the correct path to your Arabic font file

      // Pipe the PDF document to the write stream
      doc.pipe(writeStream);

      // Set the font and write content to the document
      doc.font('Arabic')
         .fontSize(30)
         .text(type+' '+sector+' '+ target, {
             align: 'center',// Since Arabic is RTL, we align to the right
             features: ['rtla']
         });

         doc.font('Arabic')
         .fontSize(25)
         .text("الطرف الاول", {
            //  width: 200,
             align: 'right',// Since Arabic is RTL, we align to the right
             features: ['rtla']
         });
         preparedFirstPartyText.forEach((element) => {
             console.log('element');
             console.log(element);
         doc.font('Arabic')
         .fontSize(15)
         .text(element, {
             align: 'right',// Since Arabic is RTL, we align to the right
             features: ['rtla']
         });
        });

        doc.font('Arabic')
        .fontSize(25)
        .text("الطرف الثاني", {
            align: 'right',// Since Arabic is RTL, we align to the right
            features: ['rtla']
        });
        preparedSecondPartyText.forEach((element) => {
            console.log('element');
            console.log(element);
        doc.font('Arabic')
        .fontSize(15)
        .text(element, {
           //  width: 200,
            align: 'right',// Since Arabic is RTL, we align to the right
            features: ['rtla']
        });
       });
       preparedFirstParagraph.forEach((element) => {
       doc.font('Arabic')
       .fontSize(15)
       .text(element, {
          //  width: 200,
           align: 'right',// Since Arabic is RTL, we align to the right
           features: ['rtla']
             });
            });
       doc.font('Arabic')
       .fontSize(15)
       .text(second_paragraph, {
          //  width: 200,
           align: 'right',// Since Arabic is RTL, we align to the right
           features: ['rtla']
       });

       preparedFirstCommitment.forEach((element) => {
        doc.font('Arabic')
        .fontSize(15)
        .text(element, {
            //  width: 200,
            align: 'right',// Since Arabic is RTL, we align to the right
            features: ['rtla']
            });
        });

        preparedSecondCommitment.forEach((element) => {
            doc.font('Arabic')
            .fontSize(15)
            .text(element, {
                //  width: 200,
                align: 'right',// Since Arabic is RTL, we align to the right
                features: ['rtla']
            });
        });

        preparedOptionalProvisionText.forEach((element) => {
            doc.font('Arabic')
            .fontSize(15)
            .text(element, {
                //  width: 200,
                align: 'right',// Since Arabic is RTL, we align to the right
                features: ['rtla']
            });
        });
        preparedPriceText.forEach((element) => {
            doc.font('Arabic')
            .fontSize(15)
            .text(element, {
                //  width: 200,
                align: 'right',// Since Arabic is RTL, we align to the right
                features: ['rtla']
            });
        });

        preparedEndText.forEach((element) => {
            doc.font('Arabic')
            .fontSize(15)
            .text(element, {
                //  width: 200,
                align: 'right',// Since Arabic is RTL, we align to the right
                features: ['rtla']
            });
        });

         doc.font('Arabic')
         .fontSize(10)
         .text('تم توليد العقد بواسطة تطبيق بسيط', 10, doc.page.height - 50, {
            align: 'left',
            lineBreak: false,
            features: ['rtla']
          });
      // Finalize the PDF
      doc.end();

      // Respond to the client once the file is saved
      writeStream.on('finish', () => {
          ctx.body = 'PDF saved to ' + savePath;
      });
      
      // Handle any errors that occur while writing to the file
      writeStream.on('error', (err) => {
          console.error(err);
          ctx.status = 500;
          ctx.body = 'Error saving the PDF';
      });
     
      const responseData = {
        data : [],
        statusCode: success_status,
        message: "file created successfully"
      }
      return responseData
  },
  async generateDocx(ctx) {
    const { contract_id } = ctx.request.body;
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
    //   const contract_id = 3; 
    // get type answer 
    let type_answers = await strapi.entityService.findMany('api::answer.answer', {
        filters:{
                type:1,
                contract : {
                        id : contract_id
                 }
            },
      });

      let types = await strapi.entityService.findMany('api::type.type', {
        filters:{
               id: type_answers[0].text
            },
      });
    let type =  types[0].name  


    let Sector_answers = await strapi.entityService.findMany('api::answer.answer', {
        filters:{
                type:2,
                contract : {
                        id : contract_id
                 }
            },
      });

      let sectors = await strapi.entityService.findMany('api::sector.sector', {
        filters:{
               id: Sector_answers[0].text
            },
      });
    let sector =  sectors[0].name 
    
    let target_answers = await strapi.entityService.findMany('api::answer.answer', {
        filters:{
                type:14,
                contract : {
                        id : contract_id
                 }
            },
      });

      let targets = await strapi.entityService.findMany('api::target.target', {
        filters:{
               id: target_answers[0].text
            },
      });
    let target =  targets[0].title
     


      let firstPartyText = await this.getContractFirstParty(contract_id);
      //prepare text for each person in first party
      let preparedFirstPartyText =await  this.prepareParagraph(firstPartyText);
     
        
      let secondPartyText = await this.getContractSecondParty(contract_id);
       //prepare text for each person in second party
      let preparedSecondPartyText =await  this.prepareParagraph(secondPartyText);
     
      let beginTextresult = await this.getContractBegin(contract_id);
      let first_paragraph = beginTextresult['first_paragraph'];
      let second_paragraph = beginTextresult['second_paragraph']
      let firstCommitmentText = await this.getContractFirstCommitment(contract_id);
      let SecondCommitmentText = await this.getContractSecondCommitment(contract_id);
      let OptionalProvisionText = await this.getContractOptionalProvision(contract_id);
       //prepare text for each person in second party
       let preparedOptionalProvisionText =await  this.prepareParagraph(OptionalProvisionText);
      let PriceText = await this.getContractPrice(contract_id);
      //prepare text for each person in price
      let preparedPriceText =await  this.prepareParagraph(PriceText);

      let endText = await this.getContractEnd(contract_id);
        //prepare text for each person in end 
      let preparedEndText =await  this.prepareParagraph(endText);


      

    try {
    
    const doc = new Document({
        creator: "Creator",
        title: "Title",
        sections: [
            {
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: type+" "+target+" "+ sector,
                                        rightToLeft: true,
                                        bold: true,
                                        size: 40,
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.LEFT,
                                children: [
                                    new TextRun({
                                        text: "تم توليده بواسطة تطبيق بسيط",
                                        rightToLeft: true,
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "",
                                rightToLeft: true,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: 'الطرف الأول',
                                rightToLeft: true,
                                bold: true,
                                size: 30,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: preparedFirstPartyText,
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: 'الطرف الثاني',
                                rightToLeft: true,
                                bold: true,
                                size: 30,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: preparedSecondPartyText,
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: first_paragraph,
                                        rightToLeft: true,
                                        size: 25,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: second_paragraph,
                                        rightToLeft: true,
                                        size: 25,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: firstCommitmentText,
                                        rightToLeft: true,
                                        size: 25,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: SecondCommitmentText,
                                        rightToLeft: true,
                                        size: 25,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: preparedOptionalProvisionText,
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: preparedPriceText,
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: preparedEndText,
                    }),
                   
                ],
            },
        ],
    });

    // // save the document
    // const packer = new docx.Packer();
        
    // Used to export the file into a .docx file
    
    Packer.toBuffer(doc).then((buffer) => {
        // fs.writeFileSync('My_Document.docx', buffer);});
        fs.writeFileSync('pdf/'+user.id+'/'+contract_id+'.docx', buffer);});
        const responseData = {
            data : [],
            statusCode: success_status,
            message: "file created successfully"
          }
          return responseData
    } catch (error) {
      console.error('Error generating Word document:', error);
      ctx.throw(500, 'Error generating Word document');
    }
  },
  async SendDocx(ctx) {
    const { contract_id } = ctx.request.body;
    //   const contract_id = 3; 
    // get type answer 
    let type_answers = await strapi.entityService.findMany('api::answer.answer', {
        filters:{
                type:1,
                contract : {
                        id : contract_id
                 }
            },
      });

      let types = await strapi.entityService.findMany('api::type.type', {
        filters:{
               id: type_answers[0].text
            },
      });
    let type =  types[0].name  


    let Sector_answers = await strapi.entityService.findMany('api::answer.answer', {
        filters:{
                type:2,
                contract : {
                        id : contract_id
                 }
            },
      });

      let sectors = await strapi.entityService.findMany('api::sector.sector', {
        filters:{
               id: Sector_answers[0].text
            },
      });
    let sector =  sectors[0].name 
    
    let target_answers = await strapi.entityService.findMany('api::answer.answer', {
        filters:{
                type:14,
                contract : {
                        id : contract_id
                 }
            },
      });

      let targets = await strapi.entityService.findMany('api::target.target', {
        filters:{
               id: target_answers[0].text
            },
      });
    let target =  targets[0].title
     


      let firstPartyText = await this.getContractFirstParty(contract_id);
      //prepare text for each person in first party
      let preparedFirstPartyText =await  this.prepareParagraph(firstPartyText);
     
        
      let secondPartyText = await this.getContractSecondParty(contract_id);
       //prepare text for each person in second party
      let preparedSecondPartyText =await  this.prepareParagraph(secondPartyText);
     
      let beginTextresult = await this.getContractBegin(contract_id);
      let first_paragraph = beginTextresult['first_paragraph'];
      let second_paragraph = beginTextresult['second_paragraph']
      let firstCommitmentText = await this.getContractFirstCommitment(contract_id);
      let SecondCommitmentText = await this.getContractSecondCommitment(contract_id);
      let OptionalProvisionText = await this.getContractOptionalProvision(contract_id);
       //prepare text for each person in second party
       let preparedOptionalProvisionText =await  this.prepareParagraph(OptionalProvisionText);
      let PriceText = await this.getContractPrice(contract_id);
      //prepare text for each person in price
      let preparedPriceText =await  this.prepareParagraph(PriceText);

      let endText = await this.getContractEnd(contract_id);
        //prepare text for each person in end 
      let preparedEndText =await  this.prepareParagraph(endText);


      

    try {
    
    const doc = new Document({
        creator: "Creator",
        title: "Title",
        sections: [
            {
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: type+" "+target+" "+ sector,
                                        rightToLeft: true,
                                        bold: true,
                                        size: 40,
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.LEFT,
                                children: [
                                    new TextRun({
                                        text: "تم توليده بواسطة تطبيق بسيط",
                                        rightToLeft: true,
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "",
                                rightToLeft: true,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: 'الطرف الأول',
                                rightToLeft: true,
                                bold: true,
                                size: 30,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: preparedFirstPartyText,
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: 'الطرف الثاني',
                                rightToLeft: true,
                                bold: true,
                                size: 30,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: preparedSecondPartyText,
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: first_paragraph,
                                        rightToLeft: true,
                                        size: 25,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: second_paragraph,
                                        rightToLeft: true,
                                        size: 25,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: firstCommitmentText,
                                        rightToLeft: true,
                                        size: 25,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: SecondCommitmentText,
                                        rightToLeft: true,
                                        size: 25,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: preparedOptionalProvisionText,
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: preparedPriceText,
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: preparedEndText,
                    }),
                   
                ],
            },
        ],
    });


    return doc;
    // // save the document
    // const packer = new docx.Packer();
        
    // Used to export the file into a .docx file
    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("My_Document.docx", buffer);});
        const responseData = {
            data : [],
            statusCode: success_status,
            message: "file created successfully"
          }
          return responseData
    } catch (error) {
      console.error('Error generating Word document:', error);
      ctx.throw(500, 'Error generating Word document');
    }
  },
  async uploadEditedContract(ctx){
    const { files } = ctx.request;
    const { contract_id } = ctx.request.body;
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
    // Ensure there is a file in the request
    if (!files || !files.file) {
      return ctx.badRequest('No file uploaded.');
    }

    const file = files.file; // Access the 'file' field

    // Assuming you want to save the file in a specific directory
    const uploadDir = path.join(__dirname, '../../../../pdf/'+user.id+'/uploads'); // Adjust the path as needed

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Construct the file path
    const filePath = path.join(uploadDir, 'edited_'+file.name);

    // Create a read stream from the file data
    const readStream = fs.createReadStream(file.path);

    // Create a write stream to save the file
    const writeStream = fs.createWriteStream(filePath);

    // Pipe the read stream to the write stream to save the file
    readStream.pipe(writeStream);

    // Handle errors during the piping process
    readStream.on('error', (err) => {
      console.error(`Error reading file: ${err.message}`);
      ctx.internalServerError('Error saving file.');
    });

    writeStream.on('error', (err) => {
      console.error(`Error writing file: ${err.message}`);
      ctx.internalServerError('Error saving file.');
    });

    writeStream.on('finish', () => {
      console.log(`File ${file.name} saved to ${filePath}`);
      ctx.send('File uploaded successfully.');
    });
  }
};