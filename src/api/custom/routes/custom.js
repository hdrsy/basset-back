module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/custom/getTypeQuestion',
        handler: 'type.getTypeQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/getSectorQuestion',
        handler: 'sector.getSectorQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerTypeQuestion',
        handler: 'type.answerTypeQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerSectorQuestion',
        handler: 'sector.answerSectorQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/createContract',
        handler: 'contract.createContract',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/getPartyQuestion',
        handler: 'party.getPartyQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerFirstPartyQuestion',
        handler: 'party.answerFirstPartyQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerSecondPartyQuestion',
        handler: 'party.answerSecondPartyQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/getBeginQuestion',
        handler: 'begin.getBeginQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerBeginQuestion',
        handler: 'begin.answerBeginQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/getEndQuestion',
        handler: 'end.getEndQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerEndQuestion',
        handler: 'end.answerEndQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      }
      ,
      {
        method: 'POST',
        path: '/custom/getMiddleQuestion',
        handler: 'middle.getMiddleQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerMiddleQuestion',
        handler: 'middle.answerMiddleQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      }
      ,
      {
        method: 'POST',
        path: '/custom/getExtraQuestion',
        handler: 'extra.getExtraQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerExtraQuestion',
        handler: 'extra.answerExtraQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/getFirstCommitmentQuestion',
        handler: 'firstcommitment.getFirstCommitmentQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerFirstCommitmentQuestion',
        handler: 'firstcommitment.answerFirstCommitmentQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/getSecondCommitmentQuestion',
        handler: 'secondcommitment.getSecondCommitmentQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerSecondCommitmentQuestion',
        handler: 'secondcommitment.answerSecondCommitmentQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/getPriceQuestion',
        handler: 'price.getPriceQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerPriceQuestion',
        handler: 'price.answerPriceQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/getProvisionQuestion',
        handler: 'provision.getProvisionQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerProvisionQuestion',
        handler: 'provision.answerProvisionQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/getCapacityQuestion',
        handler: 'capacity.getCapacityQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerCapacityQuestion',
        handler: 'capacity.answerCapacityQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
       {
        method: 'POST',
        path: '/custom/getCapacityQuestion',
        handler: 'capacity.getCapacityQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerCapacityQuestion',
        handler: 'capacity.answerCapacityQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/getTargetQuestion',
        handler: 'target.getTargetQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerTargetQuestion',
        handler: 'target.answerTargetQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/login',
        handler: 'user.login',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/register',
        handler: 'user.registerByPhone',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/docx',
        handler: 'word.generateDocx',
        config: {
          policies: []
        }
      },
      {
        method: 'POST',
        path: '/custom/getSpecificCapacityQuestion',
        handler: 'capacity.getSpecificCapacityQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/answerSecondPartyCapacityQuestion',
        handler: 'capacity.answerSecondPartyCapacityQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/getSecondPartyQuestion',
        handler: 'party.getSecondPartyQuestion',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/changePassword',
        handler: 'user.changePassword',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/custom/download',
        handler: 'word.download',
        config: {
          policies: []
        }
      },
      {
        method: 'POST',
        path: '/custom/download_docx',
        handler: 'word.download_docx',
        config: {
          policies: []
        }
      },
      {
        method: 'GET',
        path: '/custom/admin_download/:contract_id',
        handler: 'word.admin_download',
        config: {
          policies: []
        }
      },
      {
        method: 'GET',
        path: '/custom/admin_download_docx/:contract_id',
        handler: 'word.admin_download_docx',
        config: {
          policies: []
        }
      },
      {
        method: 'POST',
        path: '/custom/pdf',
        handler: 'word.generatePDF',
        config: {
          policies: []
        }
      },
      {
        method: 'GET',
        path: '/custom/getMyContracts',
        handler: 'contract.getMyContracts',
        config: {
          policies: []
        }
      },
      {
        method: 'POST',
        path: '/custom/SendDocx',
        handler: 'word.SendDocx',
        config: {
          policies: []
        }
      },
      {
        method: 'POST',
        path: '/custom/uploadEditedContract',
        handler: 'word.uploadEditedContract',
        config: {
          policies: []
        }
      },
      {
        method: 'POST',
        path: '/custom/getNextEndQuestion',
        handler: 'end.getNextEndQuestion',
        config: {
          policies: []
        }
      },
      {
        method: 'POST',
        path: '/custom/getComplexOption',
        handler: 'complex.getComplexOption',
        config: {
          policies: []
        }
      },
      ,
      {
        method: 'POST',
        path: '/custom/answerComplexQuestion',
        handler: 'complex.answerComplexQuestion',
        config: {
          policies: []
        }
      },
    ],
  };
  